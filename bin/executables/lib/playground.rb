module AlephExecutables
  class Playground
    CONFIG_OPTIONS = [:s3_region, :s3_bucket, :s3_folder]

    def self.setup(db_type, host, dsn, db, port, user, password, options = {})
      config_path = options[:config_path] || '/tmp/aleph/demo/configuration'
      seed_db = options[:seed_db]

      config_generator = ConfigGenerator.new(config_path, 'playground')

      config_generator.merge_envs(redis_url: 'redis://localhost:6379')
      config_generator.merge_envs(aleph_query_exec_worker_pool: 1)
      config_generator.merge_envs(aleph_alert_exec_worker_pool: 1)
      config_generator.merge_envs(analytic_db_type: db_type)

      properties = options.select{ |k,_| CONFIG_OPTIONS.include?(k) }.map{ |k, v| [k.to_s, v] }.to_h.
          merge({ 'auth_type' => 'disabled' })
      config_generator.write_yaml('config.yml', properties, environments: [:playground])

      if db_type == 'snowflake'
        config_generator.write_snowflake(dsn, user, password, options[:snowflake_unload_target])
      else
        config_generator.write_redshift(host, db, port, user, password)
      end

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
