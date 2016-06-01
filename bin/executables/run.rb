module AlephExecutables
  class Run < AlephForeman
    def execute!
      start_all!
    end
  end
end
