module AlephExecutables
  class SetupDb
    def initialize(options)
      @rails_env = options[:rails_env] || 'development'
    end

    def execute!
      say "Running db migrations for RAILS_ENV = #{@rails_env} ... "
      system "RAILS_ENV=#{@rails_env} bundle exec rake db:migrate"
    end
  end
end
