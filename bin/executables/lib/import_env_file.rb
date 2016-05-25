module AlephExecutables
  class ImportEnvFile
    ENV_YML = 'env.yml'
    # if a env.yml exists in the config path, try to write an .env file
    def self.execute!(config_path, rails_env = 'development')
      env_yaml_path = File.join(config_path, ENV_YML)
      return nil unless File.exists?(File.expand_path(env_yaml_path))

      env_writer = EnvWriter.new(rails_env)
      env_data = YAML.load_file(env_yaml_path)

      env_writer.merge(aleph_config_path: config_path)
      env_data.each do |k, v|
        env_writer.merge({ k.downcase.to_sym => v })
      end
      env_writer.write!
    end
  end
end
