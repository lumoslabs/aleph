def default_env_var(var, default)
  ENV[var] = ENV[var] || default
end

default_env_var('ALEPH_DB_USERNAME', 'aleph')
default_env_var('ALEPH_DB_DATABASE', "aleph_#{Rails.env}")
default_env_var('ALEPH_QUERY_EXEC_WORKER_POOL', '1')
default_env_var('ALEPH_ALERT_EXEC_WORKER_POOL', '1')
