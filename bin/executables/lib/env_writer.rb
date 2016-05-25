module AlephExecutables
  class EnvWriter
    attr_reader :env_file

    def initialize(rails_env)
      @rails_env = rails_env
      @env_file = Utils.get_env_file(rails_env)
      reset!
    end

    def reset!
      @envs = {}
    end

    def merge(properties)
      @envs.merge!(properties)
    end

    def write!
      File.open(@env_file, 'w') do |f|
        f.write(@envs.map { |k, v| "#{k.to_s.upcase}=#{v}" }.join("\n"))
      end
    end
  end
end
