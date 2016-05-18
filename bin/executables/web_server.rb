module AlephExecutables
  class WebServer < BundleRunner
    def initialize(options)
      options[:worker_processes] ||= 1
      super(options)
    end

    def execute!
      run 'puma -C config/puma.rb', :worker_processes, :rails_env
    end
  end
end
