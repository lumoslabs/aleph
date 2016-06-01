module AlephExecutables
  class CapitalistPig
    # Capitalist Pig directs the foreman, a traitor to the proletariat
    def initialize(options)
      @rails_env = options[:rails_env] || 'development'
      @procfile = options[:procfile] || 'Procfile'
      @dotenv = options[:dotenv]
    end

    def oppress!(worker)
      cmd = "RAILS_ENV=#{@rails_env} bundle exec foreman start -f #{@procfile} #{worker}"
      cmd += "--env #{@dotenv}" if @dotenv
      system cmd
    end

    def oppress_all!
      oppress!(nil)
    end
  end
end
