module AlephExecutables
  class AlephForeman
    def initialize(options)
      @rails_env = options[:rails_env] || 'development'
      @procfile = options[:procfile] || 'Procfile'
      @dotenv = options[:dotenv]
    end

    def start!(worker)
      cmd = "RAILS_ENV=#{@rails_env} bundle exec foreman start -f #{@procfile} #{worker}"
      cmd += "--env #{@dotenv}" if @dotenv
      system cmd
    end

    def start_all!
      start!(nil)
    end
  end
end
