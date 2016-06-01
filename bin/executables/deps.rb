module AlephExecutables
  class Deps
    def initialize(options)
      @rails_env = options[:rails_env] || 'development'
    end

    def execute!
      say "Running bundle install for RAILS_ENV = #{@rails_env} ... "
      system "RAILS_ENV=#{@rails_env} bundle install"
    end
  end
end
