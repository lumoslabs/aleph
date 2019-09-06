class AnalyticDBConnectionPool < SimpleCache
  include Singleton

  def new_object(role)
    config = ANALYTIC_DB_CONFIG[role]
    AnalyticDBConnectionFactory.for(config)
  end
end
