rails_root = ENV['RAILS_ROOT'] || File.dirname(__FILE__) + '/../..'
rails_env = ENV['RAILS_ENV'] || (Rails.env.to_s rescue 'development')

resque_config = YAML.load_file(rails_root + '/config/resque.yml')[rails_env]
redis = Redis.new(url: ENV['REDIS_URL'])
redis = Redis::Namespace.new(resque_config.fetch('namespace', 'aleph'), redis: redis)
Redis.current = redis
Resque.redis = redis

Resque.inline = resque_config['inline']

Resque.after_fork = Proc.new do
  ActiveRecord::Base.establish_connection
end
