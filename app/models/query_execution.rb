class QueryExecution
  @queue = :query_exec
  NUM_SAMPLE_ROWS = 100
  SNOWFLAKE_UNLOAD_SQL = <<-EOF
COPY INTO %{location} FROM (
%{query}
)
FILE_FORMAT = (TYPE = 'csv' FIELD_DELIMITER = ',' RECORD_DELIMITER = '\\n' FIELD_OPTIONALLY_ENCLOSED_BY = '"' 
  NULL_IF = ('') COMPRESSION = NONE)
HEADER = TRUE 
SINGLE = TRUE
OVERWRITE = TRUE
MAX_FILE_SIZE = %{max_file_size}
EOF

  def self.perform(result_id, role)
    result = Result.find(result_id)
    csv_service = CsvService.new(result_id)

    unless Role.configured_connections.include?(role)
      raise "Role '#{role}' does not have connection credentials configured."
    end

    body = result.compiled_body
    result.mark_running!
    sample_callback = ->(sample) { result.mark_processing_from_sample(sample) }

    connection = AnalyticDBConnectionPool.instance.get(role)
    if connection.is_a? RedshiftPG::Connection
      query_redshift(connection, body, result, sample_callback, csv_service)
    else
      query_snowflake(connection, body, result, sample_callback)
    end

  rescue => e
    if result && csv_service
      csv_service.clear_tmp_file
      result.mark_failed!(e.message)
    end
    raise
  end

  private

  def self.query_redshift(connection, body, result, sample_callback, csv_service)
    connection.reconnect_on_failure do
      query_stream = PgStream::Stream.new(connection.pg_connection, body)
      result.headers = query_stream.headers
      result.save!

      rrrc = result.redis_result_row_count

      stream_processor = PgStream::Processor.new(query_stream)
      stream_processor.register(ResultCsvGenerator.new(result.id, result.headers).callbacks)
      stream_processor.register(SampleSkimmer.new(NUM_SAMPLE_ROWS, &sample_callback).callbacks)
      stream_processor.register(CountPublisher.new(rrrc).callbacks)

      row_count = stream_processor.execute
      result.mark_complete_with_count(row_count)
    end

  rescue *RedshiftPG::USER_ERROR_CLASSES => e
    csv_service.clear_tmp_file
    result.mark_failed!(e.message)
  end

  def self.query_snowflake(connection, body, result, sample_callback)
    # unload the query result from snowflake directly into s3
    # then read in the first 100 rows from the file as sample rows
    # Note: snowflake unload currently has a max file size of 5 GB.
    connection.reconnect_on_failure do
      body = body.strip.gsub(/;$/, '')
      location = File.join(connection.unload_target, result.current_result_filename)
      sql = SNOWFLAKE_UNLOAD_SQL % {location: location, query: body, max_file_size: connection.max_file_size}
      row = connection.connection.fetch(sql).first
      row_count = row[:rows_unloaded]

      headers, samples = CsvSerializer.load_from_s3_file(result.current_result_s3_key, NUM_SAMPLE_ROWS)

      result.headers = headers
      result.save!

      sample_callback.call(samples)
      result.mark_complete_with_count(row_count)
    end
  end
end
