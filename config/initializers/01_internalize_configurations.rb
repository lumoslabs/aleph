class AlephConfigIngest
  def initialize
    @config_path = ENV['ALEPH_CONFIG_PATH'] || '/tmp/aleph/configuration'
    raise "Missing #{@config_path}" unless file_exists?(@config_path)
  end

  def file_exists?(p)
    File.exists? File.expand_path p
  end

  def slurp(file)
    p = File.join(@config_path, file)
    file_exists?(p) ? YAML.load_file(p) : nil
  end
end

ingest = AlephConfigIngest.new

# Application Configuration
# -------------------------------------------------
unless defined? APP_CONFIG
  config = ingest.slurp('config.yml')
  APP_CONFIG = config[Rails.env.to_s] || {}
end

# Role Heirarchy
# -------------------------------------------------
unless defined? ROLE_HIERARCHY
  role_hierarchy = ingest.slurp('role_hierarchy.yml')
  ROLE_HIERARCHY = role_hierarchy || { Role::ADMIN_ROLE => [] }
  ROLES = ROLE_HIERARCHY.flat_map { |k, v| [k] + v }.uniq
end

# Redshift Connections
# -------------------------------------------------
unless defined? REDSHIFT_DB_CONFIG
  redshift = ingest.slurp('redshift.yml')
  raise "Invalid redshift.yml file for env = #{Rails.env.to_s}" unless redshift && redshift[Rails.env.to_s]
  REDSHIFT_DB_CONFIG = {}
  Role.configured_connections.each do |role|
    REDSHIFT_DB_CONFIG[role] = redshift[Rails.env.to_s].merge(
      'username' => ENV[Role.name_to_username_key(role)],
      'password' => ENV[Role.name_to_password_key(role)]
    )
  end
end

# smtp_settings
# -------------------------------------------------
unless defined? EMAIL_CONFIG
  alerts = ingest.slurp('email.yml')
  EMAIL_CONFIG = alerts && alerts[Rails.env.to_s] ? alerts[Rails.env.to_s] : {}
  if EMAIL_CONFIG
    smtp = EMAIL_CONFIG['smpt_settings']
    if smtp
      smtp['password'] = ENV['SMTP_PASSWORD']
      ActionMailer::Base.smtp_settings = smtp.symbolize_keys
    end

    default_url_host = EMAIL_CONFIG['default_url_host']
    if default_url_host
      ActionMailer::Base.default_url_options[:host] = default_url_host
    end
  end
end

# Auth Attribute Map
# -------------------------------------------------
ATTRIBUTE_MAP = ingest.slurp('auth-attribute-map.yml')
File.open(Rails.root.join('config', 'attribute-map.yml'), 'w') { |f| f.write(ATTRIBUTE_MAP.to_yaml) } if ATTRIBUTE_MAP

# Schema Blacklist
# -------------------------------------------------
TABLE_BLACKLIST = ingest.slurp('table_blacklist.yml')
