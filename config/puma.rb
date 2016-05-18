threads 0, 16
workers ENV['WORKER_PROCESSES'].to_i
bind 'tcp://0.0.0.0:3000'

if ENV['RAILS_ENV'] == 'production' || ENV['RAILS_ENV'] == 'staging'
  log_root = ENV['SERVER_LOG_ROOT'] || '/var/log/aleph'
  stdout_dir = File.join(log_root, 'puma.stdout.log')
  stderr_dir = File.join(log_root, 'puma.stderr.log')
  stdout_redirect stdout_dir, stderr_dir, true
end
