class Role
  ADMIN_ROLE = 'admin'.freeze

  class << self
    USERNAME_POSTFIX = "_#{AnalyticDBConnectionFactory::DB_TYPE}_USERNAME".upcase.freeze
    PASSWORD_POSTFIX = "_#{AnalyticDBConnectionFactory::DB_TYPE}_PASSWORD".upcase.freeze

    def name_to_username_key(name)
      "#{name.upcase}#{USERNAME_POSTFIX}"
    end

    def name_to_password_key(name)
      "#{name.upcase}#{PASSWORD_POSTFIX}"
    end

    def password_key_to_name(key)
      key.sub(PASSWORD_POSTFIX, '').downcase
    end

    def username_key_to_name(key)
      key.sub(USERNAME_POSTFIX, '').downcase
    end

    def configured_connections
      @configured_connections ||= determine_configured_connections
    end

    def determine_configured_connections
      role_username_keys = ENV.keys.select { |env_key| env_key.include?(USERNAME_POSTFIX) }
      role_password_keys = ENV.keys.select { |env_key| env_key.include?(PASSWORD_POSTFIX) }
      username_configured_roles = role_username_keys.map { |key| username_key_to_name(key) }
      password_configured_roles = role_password_keys.map { |key| password_key_to_name(key) }
      password_configured_roles.select do |role|
        username_configured_roles.include?(role)
      end
    end
  end
end
