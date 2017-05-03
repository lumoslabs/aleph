module Schemas
  class Descriptor
    include RedisStore
    INFORMATION_SCHEMA_QUERY = <<-SQL
      SELECT
        table_schema,
        table_name,
        column_name,
        udt_name,
        character_maximum_length
      FROM information_schema.columns
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog', 'public')
      ORDER BY table_schema, table_name, ordinal_position;
    SQL

    SCHEMA_REFRESH_INTERVAL = APP_CONFIG['schema_refresh_interval'] || 1.day

    def initialize(role)
      @role = role
      @cache = []

      Rails.logger.info("Start schema refresher thread for #{@role}")
      @refresher_thread = Thread.new{ schema_refresher }
    end

    def schemas
      retrieve.map { |row| row['table_schema'] }.uniq
    end

    def table_columns(schema)
      retrieve.select { |row| row['table_schema'] == schema }.group_by { |row| row['table_name'] }
    end

    def columns
      retrieve.map do |column|
        HashWithIndifferentAccess.new(
          column: column['column_name'],
          table: column['table_name'],
          schema: column['table_schema'],
          type: column['udt_name']
        )
      end
    end

    def key
      @key ||= "#{@role}_schema_descriptor"
    end

    private

    def retrieve
      if !@cache.present?
        @cache = redis_retrieve
      end
      return @cache
    end

    def schema_refresher
      loop do
        refresh_schema
        sleep(SCHEMA_REFRESH_INTERVAL)
      end
    end

    def refresh_schema
      Rails.logger.info('Schemas::Descriptor.refresh_schema')
      result = nil
      Pester.schema_refresh.retry do
        result = exec_schema_query
      end

      if result
        redis_store!(filter_tables(result.to_a))
        @cache = redis_retrieve
      end
    end

    def exec_schema_query
      connection = RedshiftConnectionPool.instance.get(@role)
      connection.reconnect_on_failure do
        connection.pg_connection.exec(INFORMATION_SCHEMA_QUERY)
      end
    end

    def filter_tables(schemas)
      return schemas unless TABLE_BLACKLIST
      
      schemas.reject do |column|
        schema_blacklist = TABLE_BLACKLIST[column['table_schema']]
        next unless schema_blacklist
        schema_blacklist.any? { |bl_item| Regexp.new(bl_item).match(column['table_name']) }
      end
    end
  end
end
