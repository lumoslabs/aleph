module AlephExecutables
  class Worker < BundleRunner
    def execute!
      run 'rake resque:pool', :rails_env
    end
  end
end
