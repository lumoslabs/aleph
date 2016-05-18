module AlephExecutables
  class Clock < BundleRunner
    def execute!
      run 'clockwork lib/clock.rb', :rails_env
    end
  end
end
