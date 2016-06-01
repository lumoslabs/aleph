module AlephExecutables
  class Worker < AlephForeman
    def execute!
      start!('worker')
    end
  end
end
