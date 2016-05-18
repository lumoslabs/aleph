module AlephExecutables
  class InitDb < BundleRunner
    def execute!
      run 'rake db:create', :rails_env
    end
  end
end
