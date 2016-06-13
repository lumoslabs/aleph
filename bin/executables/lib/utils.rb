module AlephExecutables
  class Utils
    def self.fail(msg, banner = nil)
      msg += "\n#{banner}" if banner
      puts msg;
      exit(false)
    end

    def self.inform(msg, banner = nil)
      msg += "\n#{banner}" if banner
      puts msg;
      exit(true)
    end

    def self.get_env_file(rails_env)
      !rails_env || (rails_env == 'development') ? '.env' : ".env.#{rails_env}"
    end

    def self.bundle_exec_with_clean_env(cmd_suffix, envs = nil)
      cmd = 'bundle exec ' + cmd_suffix
      if envs
        env_str = envs.reject{ |k, v| !v }.map{ |k, v| "#{k.to_s.upcase}=#{v}" }.join(' ')
        cmd = env_str + ' ' + cmd
      end

      puts "Running #{cmd} ... "
      Bundler.with_clean_env { system cmd }
    end
  end
end
