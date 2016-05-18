module AlephExecutables
  class Deps
    def initialize(options); end

    def execute!
      puts 'Running bundle install ...'
      Bundler.with_clean_env { system 'bundle install' }
    end
  end
end
