module Authentication
  class << self
    ACCEPTABLE_TYPES = %w(
      saml
      database
      disabled
    ).freeze

    def type
      raise 'auth_type must be present in config.yml' unless APP_CONFIG['auth_type']
      unless ACCEPTABLE_TYPES.include?(APP_CONFIG['auth_type'])
        raise "Unacceptable auth_type, valid types are: #{ACCEPTABLE_TYPES.join(',')}"
      end
      APP_CONFIG['auth_type'].try(:inquiry)
    end
  end
end
