class RedshiftConnectionPool < SimpleCache
  include Singleton

  def new_object(role)
    config = REDSHIFT_DB_CONFIG[role]
    RedshiftPG::Connection.new(config)
  end
end
