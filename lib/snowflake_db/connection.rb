require 'odbc_utf8'
require 'sequel'
module SnowflakeDB
  class Connection
    attr_reader :config, :unload_target, :max_file_size

    PG_INCLUDE_KEYS = %w(host dbname port user password)
    MAX_FILE_SIZE = (5*1024*1024*1024).freeze

    def initialize(config)
      @config = config
      @statement_timeout = config['statement_timeout']
      @unload_target = config['unload_target']
      @max_file_size = config['max_file_size'] || MAX_FILE_SIZE
    end

    def reconnect_on_failure(&block)
      begin
        return yield
      rescue Sequel::DatabaseError => e
        raise unless connection_expired_error?(e)
        connection.reset
        return yield
      end
    end

    def connection
      @connection ||= connect!
    end

    def fetch_all_hash(query)
      # execute a query and return the entire result as an array of hashes keyed by column names
      result = []
      reconnect_on_failure do
        connection.fetch(query) do |row|
          result << Hash[row.map { |k, v| [k.to_s, v] }]
        end
      end
      result
    end

    private

    def connection_expired_error?(exception)
      # Whether the given exception is due connection expired error.  e.g.
      # ODBC::Error: 08001 (390114) Authentication token has expired.  The user must authenticate again.
      exception.message =~ /\(39011[0-5]\)/
    end

    def connect!
      Sequel.odbc(config['dsn'], user: config['username'], password: config['password']).tap do |conn|
        conn.run("ALTER SESSION SET STATEMENT_TIMEOUT_IN_SECONDS = #{@statement_timeout}/1000") if @statement_timeout
      end
    end
  end
end
