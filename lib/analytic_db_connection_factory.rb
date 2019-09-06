class AnalyticDBConnectionFactory
  DB_TYPE = (ENV['ANALYTIC_DB_TYPE'] || 'redshift').downcase.freeze

  TYPES = {
      redshift: RedshiftPG::Connection,
      snowflake: SnowflakeDB::Connection
  }

  def self.for(config)
    (TYPES[DB_TYPE.to_sym] || RedshiftPG::Connection).new(config)
  end
end