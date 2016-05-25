module AlephExecutables
  class Run
    def initialize(options)
      @rails_env = options[:rails_env] || 'development'
      @config_path = options[:config_path]
      @banner = options[:banner]

      Utils.fail('Need to supply config-path', @banner) unless @config_path
      ImportEnvFile.execute!(@config_path, @rails_env)
      @env_file = Utils.get_env_file(@rails_env)
    end

    def execute!
      system "RAILS_ENV=#{@rails_env} bundle install"
      system "RAILS_ENV=#{@rails_env} bundle exec foreman start --env #{@env_file}"
    end
  end
end
