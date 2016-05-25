module AlephExecutables
  class Utils
    def self.fail(msg, banner)
      msg += "\n#{banner}" if banner
      puts msg;
      exit(false)
    end

    def self.get_env_file(rails_env)
      !rails_env || (rails_env == 'development') ? '.env' : ".env.#{rails_env}"
    end
  end
end
