require 'resque/pool/tasks'

task 'resque:setup' => :environment # If you want any Resque specific configuration, set it in here

task "resque:pool:setup" do
  # close any sockets or files in pool manager
  ActiveRecord::Base.connection.disconnect!
  # and re-open them in the resque worker parent
  Resque::Pool.after_prefork do |job|
    ActiveRecord::Base.establish_connection
  end
end

task 'resque:pool:setup' do
  Resque::Pool.after_prefork do |job|
    Resque.redis.client.reconnect
  end
end
