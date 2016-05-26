require 'highline/import'

module AlephExecutables
  class Playground
    DEFAULT_CONFIGURATION_PATH = '/tmp/aleph/configuration'
    PLAYGROUND_ENV = 'playground'

    def initialize(options); end

    def execute!
      configurator, env_writer, config_path = nil, nil, nil

      say 'Hi! Welcome to the Aleph playground!'
      if agree('We need to do some set up, begin?') { |x| x.default = 'yes' }

        config_path = ask('Please specify a configuration path') do |ac|
          ac.default = DEFAULT_CONFIGURATION_PATH
        end

        config_generator = ConfigGenerator.new(config_path, PLAYGROUND_ENV)
        env_writer = config_generator.env_writer

        # * run migrations *
        # ==================
        say 'Running some db migrations as needed ... '
        system "RAILS_ENV=#{PLAYGROUND_ENV} bundle exec rake db:migrate"
        say 'Done.'

        # * install redis *
        # ==================
        if agree('Aleph requires redis. If you have redis installed already you can skip this. Install redis?') { |x| x.default = 'yes' }
          say 'installing redis'
          #system 'brew install redis'

          env_writer.merge(redis_url: 'redis://localhost:6379')
          env_writer.merge(aleph_query_exec_worker_pool: 1)
          env_writer.merge(aleph_alert_exec_worker_pool: 1)
          say 'Done.'
        end

        # * default configs *
        # ===================
        say 'Writing some default configurations in your configuration directory ... '
        config_generator.write_default_config_yml
        say 'Done'

        # * redshift connection *
        # =======================
        redshift_configured = true

        if agree("Do you have a Redshift cluster you would like to connect to?") { |x| x.default = 'no' }
          host = ask('What is the hostname?')
          database = ask('What is the database name?')
          port = ask('What is the port') { |x| x.default = '5439' }
          user = ask('What is the username?')
          password = ask('What is the password?')

          config_generator.write_redshift(host, database, port, user, password)
        else
          if agree("Would you like to connect to our sample Redshift cluster?") { |x| x.default = 'yes' }
            config_generator.write_redshift('aleph-public.cdiwpivlvfxt.us-east-1.rds.amazonaws.com', 'aleph_public', '5432', 'read_only', '@lephR3@d0nlee')
          else
            redshift_configured = false
            say "Ok, you can set up your Redshift connection later by editing #{config_path}/redshift.yml"
          end
        end

        env_writer.write!

        if redshift_configured && agree("Ok, Aleph is configured. Do you want to run it now?") { |x| x.default = 'yes' }
          say 'Check out localhost:3000!'
          system "RAILS_ENV=#{PLAYGROUND_ENV} bundle exec foreman start --env .env.#{PLAYGROUND_ENV}"
        end
      else
        say 'Ok, Bye!'
      end
    end
  end
end
