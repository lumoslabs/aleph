module AlephExecutables
  class SetupDemo
    # emo db constants
    PLAYGROUND_HOST             = 'aleph-public.cdiwpivlvfxt.us-east-1.rds.amazonaws.com'.freeze
    PLAYGROUND_DB               = 'aleph_public'.freeze
    PLAYGROUND_PORT             = '5432'.freeze
    PLAYGROUND_USER             = 'read_only'.freeze
    PLAYGROUND_PASSWORD         = '@lephR3@d0nlee'.freeze

    def initialize(options)
      @options = options
    end

    def execute!
      @config_path = @options[:config_path] || '/tmp/aleph/configuration'
      config_generator = ConfigGenerator.new(@config_path, PLAYGROUND_ENV)

      # redis envs
      config_generator.env_writer.merge(redis_url: 'redis://localhost:6379')
      config_generator.env_writer.merge(aleph_query_exec_worker_pool: 1)
      config_generator.env_writer.merge(aleph_alert_exec_worker_pool: 1)

      config_generator.write_default_config_yml
      config_generator.write_redshift(PLAYGROUND_HOST, PLAYGROUND_DB, PLAYGROUND_PORT, PLAYGROUND_USER, PLAYGROUND_PASSWORD)
      config_generator.write_envs!

      Bundler.with_clean_env do
        system 'bundle install'
        Seeder.execute!
        puts 'checkout port 3000!'
        system 'RAILS_ENV=playground bundle exec foreman start --env .env.playground'
      end
    end
  end
end
