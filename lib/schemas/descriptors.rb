module Schemas
  class Descriptors < SimpleCache
    include Singleton

    def new_object(role)
      raise "Role '#{role}' not configured" unless Role.configured_connections.include?(role)
      Descriptor.new(role)
    end
  end
end
