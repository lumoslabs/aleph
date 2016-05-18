require 'highline/import'
require 'fileutils'

module AlephExecutables
  class Playground
    STATE_FILE                  = '.playground.yml'.freeze
    DEFAULT_CONFIGURATION_PATH  = '/tmp/aleph/configuration'.freeze
    PLAYGROUND_ENV              = 'playground'.freeze

    # * playround db constants *
    # ==========================
    PLAYGROUND_HOST             = 'aleph-public.cdiwpivlvfxt.us-east-1.rds.amazonaws.com'.freeze
    PLAYGROUND_DB               = 'aleph_public'.freeze
    PLAYGROUND_PORT             = '5432'.freeze
    PLAYGROUND_USER             = 'read_only'.freeze
    PLAYGROUND_PASSWORD         = '@lephR3@d0nlee'.freeze

    def initialize(options); end

    def intial_configuration
      config_path = ask('Please specify a configuration path') do |ac|
        ac.default = DEFAULT_CONFIGURATION_PATH
      end

      config_generator = ConfigGenerator.new(config_path, PLAYGROUND_ENV)

      # * redis envs *
      # ==============
      config_generator.env_writer.merge(redis_url: 'redis://localhost:6379')
      config_generator.env_writer.merge(aleph_query_exec_worker_pool: 1)
      config_generator.env_writer.merge(aleph_alert_exec_worker_pool: 1)

      # * default configs *
      # ===================
      config_generator.write_default_config_yml
      config_generator
    end

    def configure_redshift_connection(config_generator)
      redshift_configured = true
      use_public_redshift = false
      if agree("Do you have a Redshift cluster you would like to connect to?") { |x| x.default = 'no' }
        host = ask('What is the hostname?')
        database = ask('What is the database name?')
        port = ask('What is the port') { |x| x.default = '5439' }
        user = ask('What is the username?')
        password = ask('What is the password?')

        config_generator.write_redshift(host, database, port, user, password)
      else
        if agree("Would you like to connect to our sample Redshift cluster?") { |x| x.default = 'yes' }
          config_generator.write_redshift(PLAYGROUND_HOST, PLAYGROUND_DB, PLAYGROUND_PORT, PLAYGROUND_USER, PLAYGROUND_PASSWORD)
          use_public_redshift = true
        else
          redshift_configured = false
          say "Ok, you can set up your Redshift connection later by editing #{config_generator.path}/redshift.yml"
        end
      end

      [redshift_configured, use_public_redshift]
    end

    def setup_deps!
      say 'Running bundle install ... '
      Bundler.with_clean_env { system 'bundle install' }
      if $?.exitstatus != 0
        Utils.fail('Oops, something bad happened during bundle install')
      end
      say 'Done.'
    end

    def setup_db!
      say 'Running some db migrations as needed ... '
      Bundler.with_clean_env do
        system "RAILS_ENV=#{PLAYGROUND_ENV} bundle exec rake db:create"
        system "RAILS_ENV=#{PLAYGROUND_ENV} bundle exec rake db:migrate"
      end
      say 'Done.'
    end

    def run!
      say 'Check out localhost:3000!'
      Bundler.with_clean_env do
        system "RAILS_ENV=#{PLAYGROUND_ENV} bundle exec foreman start --env .env.#{PLAYGROUND_ENV}"
      end
    end

    def save_state(config_path, redshift_configured)
      properties = {
        'config_path' => config_path,
        'redshift_configured' => redshift_configured
      }
      File.open(STATE_FILE, 'w') { |f| f.write(properties.to_yaml) }
    end

    def execute!
      saved = File.exists?(STATE_FILE) ? YAML.load_file(STATE_FILE) : nil

      if saved && saved['config_path'] && saved['redshift_configured']
        # we are fully configured already, just run
        run!
      elsif saved && saved['config_path'] && !saved['redshift_configured']
        # we still need to configure redshift
        say 'It looks like your Redshift connection still needs to be configured'

        config_path = saved['config_path']
        config_generator = ConfigGenerator.new(state['config_path'], PLAYGROUND_ENV)
        redshift_configured, use_public_redshift = configure_redshift_connection(config_generator)
        save_state(config_path, redshift_configured)

        run! if redshift_configured && agree("Ok, Aleph is set up. Do you want to run it now?") { |x| x.default = 'yes' }
      else
        # we need the full set up
        say 'Hi! Welcome to the Aleph playground!'
        if agree('We need to do a tiny bit of set up, begin?') { |x| x.default = 'yes' }
          config_generator = intial_configuration
          redshift_configured, use_public_redshift = configure_redshift_connection(config_generator)
          config_generator.write_envs!
          setup_deps!
          use_public_redshift ? Seeder.execute! : setup_db!
          save_state(config_generator.path, redshift_configured)

          run! if redshift_configured && agree("Ok, Aleph is set up. Do you want to run it now?") { |x| x.default = 'yes' }
        else
          say 'Ok, Bye!'
        end
      end
    end
  end
end
