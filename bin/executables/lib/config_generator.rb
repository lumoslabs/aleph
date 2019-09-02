require 'fileutils'
require 'yaml'

module AlephExecutables
  class ConfigGenerator
    attr_reader :env_writer, :path

    def initialize(path, rails_env)
      @path = path
      @rails_env = rails_env
      FileUtils.mkdir_p(@path)
      @env_writer = EnvWriter.new(@rails_env)
      @env_writer.merge(aleph_config_path: path)
    end

    def write_redshift(host, database, port, user, password)
      redshift_properties = {
        'host' => host,
        'database' => database,
        'port' => port
      }
      write_yaml('redshift.yml', redshift_properties, environments: [@rails_env.to_sym])
      @env_writer.merge(admin_redshift_username: user, admin_redshift_password: password)
    end

    def write_snowflake(dsn, user, password, unload_target)
      snowflake_properties = {
          'dsn' => dsn,
          'unload_target' => unload_target
      }
      write_yaml('snowflake.yml', snowflake_properties, environments: [@rails_env.to_sym])
      @env_writer.merge(admin_snowflake_username: user, admin_snowflake_password: password)
    end

    def write_envs!
      @env_writer.write!
    end

    def merge_envs(h)
      @env_writer.merge(h)
    end

    def write_yaml(file, properties, options = {})
      full_path = File.join(@path, file)

      # expand out properties per enviorment if exists
      expanded_properties = if options[:environments]
        options[:environments].inject({}) do |acc, env|
          acc.merge({ env.to_s => properties })
        end
      else
        properties
      end

      # write out config
      File.open(full_path, 'w') { |f| f.write(expanded_properties.to_yaml) }
    end
  end
end
