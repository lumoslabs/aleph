module AlephExecutables
  class Playground
    def self.setup(host, db, port, user, password, options = {})
      config_path = options[:config_path] || '/tmp/aleph/demo/configuration'

      seed_db = options[:seed_db]

      config_generator = ConfigGenerator.new(config_path, 'playground')

      # redis envs
      config_generator.merge_envs(redis_url: 'redis://localhost:6379')
      config_generator.merge_envs(aleph_query_exec_worker_pool: 1)
      config_generator.merge_envs(aleph_alert_exec_worker_pool: 1)

      config_generator.write_default_config_yml
      config_generator.write_redshift(host, db, port, user, password)
      config_generator.write_envs!

      Bundler.with_clean_env do
        system 'bundle install'
        if $?.exitstatus != 0
          Utils.fail('Oops, something bad happened during bundle install')
        end
      end

      seed_db ? db_seed : db_rebuild

      puts "Configuration generated in #{config_path}"
    end

    def self.run
      Bundler.with_clean_env { system 'RAILS_ENV=playground bundle exec foreman start --env .env.playground' }
    end

    private

    def self.db_seed
      Seeder.execute!
    end

    def self.db_rebuild
      Bundler.with_clean_env { system 'RAILS_ENV=playground bundle exec rake db:drop db:create db:migrate' }
    end
  end
end
