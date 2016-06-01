module AlephExecutables
  class Clock < AlephForeman
    def execute!
      start!('clock')
    end
  end
end
