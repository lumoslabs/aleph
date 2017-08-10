class QueryExecution
  @queue = :query_exec
  NUM_SAMPLE_ROWS = 100
  QUERY_TIMEOUT = APP_CONFIG['query_timeout'] || 30.minutes.to_i

  def self.perform(result_id, role)
    result = Result.find(result_id)

    unless Role.configured_connections.include?(role)
      raise "Role '#{role}' does not have connection credentials configured."
    end

    body = result.compiled_body
    result.mark_running!
    sample_callback = ->(sample) { result.mark_processing_from_sample(sample) }
    result_csv_generator = ResultCsvGenerator.new(result_id, result.headers)
    begin
      Timeout::timeout(QUERY_TIMEOUT) do
        connection = RedshiftConnectionPool.instance.get(role)

        connection.reconnect_on_failure do
          query_stream = PgStream::Stream.new(connection.pg_connection, body)
          result.headers = query_stream.headers
          result.save!

          rrrc = result.redis_result_row_count

          stream_processor = PgStream::Processor.new(query_stream)
          stream_processor.register(result_csv_generator.callbacks)
          stream_processor.register(SampleSkimmer.new(NUM_SAMPLE_ROWS, &sample_callback).callbacks)
          stream_processor.register(CountPublisher.new(rrrc).callbacks)

          row_count = stream_processor.execute
          result.mark_complete_with_count(row_count)
        end
      end
    rescue *RedshiftPG::USER_ERROR_CLASSES => e
      result.mark_failed!(e.message)
    rescue Timeout::Error => e
      File.delete(result_csv_generator.filepath) if File.exist?(result_csv_generator.filepath)
      result.mark_failed!("Your query timed out because it run for loger than #{QUERY_TIMEOUT}.")
    rescue => e
      result.mark_failed!(e.message) if result
      raise
    end
  end
end
