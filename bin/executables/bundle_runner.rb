module AlephExecutables
  class BundleRunner
    def initialize(options)
      @options = options
    end

    def run(cmd, *env_vars)
      evs = *env_vars
      Utils.bundle_exec_with_clean_env(cmd, @options.select{ |k,v| evs.include?(k) })
    end
  end
end
