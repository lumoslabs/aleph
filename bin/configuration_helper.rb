require 'fileutils'
require 'yaml'

class ConfigurationUtils
  ENV_FILE = '.env.playground'.freeze

  def self.file_exists?(p)
    File.exists?(File.expand_path(p))
  end

  def self.merge_to_env(properties)
    env = {}

    if file_exists?(ENV_FILE)
      File.open(ENV_FILE, 'r') do |f|
        f.each_line do |line|
          k, v = line.split('=')
          env[k.chomp.downcase.to_sym] = v.chomp
        end
      end
    end

    env.merge!(properties)

    File.open(ENV_FILE, 'w') do |f|
      f.write(env.map { |k, v| "#{k.to_s.upcase}=#{v}" }.join("\n"))
    end
  end
end

class Configurator
  COMMENTS_PATH = 'comments'.freeze

  def initialize(path)
    @path = path
    FileUtils.mkdir_p(path)
    ConfigurationUtils.merge_to_env(aleph_config_path: path)
  end

  def write_redshift(host, database, port, user, password)
    redshift_properties = {
      'host' => host,
      'database' => database,
      'port' => port
    }

    write_yaml('redshift.yml', redshift_properties, environments: [:playground])
    ConfigurationUtils.merge_to_env({
      'admin_redshift_username' => user,
      'admin_redshift_password' => password
    })
  end

  def write_default_config_yml
    properties = {
      'auth_type' => 'disabled'
    }

    write_yaml('config.yml', properties, environments: [:playground])
  end

  def write_yaml(file, properties, options = {})

    full_path = File.join(@path, file)
    comments_path = File.join(COMMENTS_PATH, file)

    # ingest comments for this config
    comments = []
    if comments_path && ConfigurationUtils.file_exists?(comments_path)
      File.open(comments_path, 'r') do |f|
        f.each_line do |line|
          comments << line
        end
      end
    end

    # expand out properties per enviorment if exists
    expanded_properties = if options[:environments]
      options[:environments].inject({}) do |acc, env|
        acc.merge({ env.to_s => properties })
      end
    else
      properties
    end

    # write out config
    out = '';
    if comments.size > 0
      out = comments.join("\n")
      out += "\n"
    end

    out += expanded_properties.to_yaml
    File.open(full_path, 'w') { |f| f.write(out) }
  end
end
