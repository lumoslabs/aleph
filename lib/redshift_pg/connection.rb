require 'pg'
module RedshiftPG
  class Connection
    attr_reader :config

    SQL_TO_PG_KEY_MAP = {
      'username' => 'user',
      'database' => 'dbname'
    }

    PG_INCLUDE_KEYS = %w(host dbname port user password)

    def initialize(config)
      @config = config
      @statement_timeout = config['statement_timeout']
    end

    def reconnect_on_failure(&block)
      begin
        return yield
      rescue PG::UnableToSend, PG::ConnectionBad
        pg_connection.reset
        return yield
      end
    end

    def pg_connection
      @pg_connection ||= connect!
    end

    private

    def connect!
      ::PG.connect(pg_config).tap do |conn|
        conn.exec("SET statement_timeout to #{@statement_timeout}") if @statement_timeout
      end
    end

    def pg_config
      kvs = @config.map do |k, v|
        converted_key = SQL_TO_PG_KEY_MAP.fetch(k, k)
        next unless PG_INCLUDE_KEYS.include?(converted_key)
        [converted_key, v]
      end.compact
      Hash[kvs]
    end
  end
end
