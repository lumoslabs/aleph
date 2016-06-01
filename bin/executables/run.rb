module AlephExecutables
  class Run
    def initialize(options)
      @rails_env = options[:rails_env] || 'development'
      @dotenv = options[:dotenv]
    end

    def execute!
      cmd = "RAILS_ENV=#{@rails_env} bundle exec foreman start"
      cmd += "--env #{@dotenv}" if @dotenv
      system cmd
    end
  end
end
