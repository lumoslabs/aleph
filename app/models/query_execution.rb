class QueryExecution
  @queue = :query_exec
  NUM_SAMPLE_ROWS = 100

  def self.perform(result_id, role)
    result = Result.find(result_id)
    csv_service = CsvService.new(result_id)

    unless Role.configured_connections.include?(role)
      raise "Role '#{role}' does not have connection credentials configured."
    end

    body = result.compiled_body
    result.mark_running!
    sample_callback = ->(sample) { result.mark_processing_from_sample(sample) }

    connection = RedshiftConnectionPool.instance.get(role)

    connection.reconnect_on_failure do
      query_stream = PgStream::Stream.new(connection.pg_connection, body)
      result.headers = query_stream.headers
      result.save!

      rrrc = result.redis_result_row_count

      stream_processor = PgStream::Processor.new(query_stream)
      stream_processor.register(ResultCsvGenerator.new(result_id, result.headers).callbacks)
      stream_processor.register(SampleSkimmer.new(NUM_SAMPLE_ROWS, &sample_callback).callbacks)
      stream_processor.register(CountPublisher.new(rrrc).callbacks)

      row_count = stream_processor.execute
      result.mark_complete_with_count(row_count)
    end
  rescue *RedshiftPG::USER_ERROR_CLASSES => e
    csv_service.clear_tmp_file
    result.mark_failed!(e.message)
  rescue => e
    if result && csv_service
      csv_service.clear_tmp_file
      result.mark_failed!(e.message)
    end
    raise
  end
end
