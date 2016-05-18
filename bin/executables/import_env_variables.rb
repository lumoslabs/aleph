module AlephExecutables
  class ImportEnvVariables
    def initialize(options)
      @rails_env = options[:rails_env] || 'development'
      @config_path = options[:config_path]
      @banner = options[:banner]

      Utils.fail('Need to supply config-path', @banner) unless @config_path
    end

    def execute!
      env_file = Utils.get_env_file(@rails_env)
      say "Importing #{File.join(@config_path, ImportEnvFile::ENV_YML)} to #{env_file}"
      ImportEnvFile.execute!(@config_path, @rails_env)
    end
  end
end
