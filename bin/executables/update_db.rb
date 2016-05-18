module AlephExecutables
  class UpdateDb < BundleRunner
    def execute!
      run 'rake db:migrate', :rails_env
    end
  end
end
