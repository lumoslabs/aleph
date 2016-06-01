module AlephExecutables
  class WebServer < AlephForeman
    def execute!
      start!('web')
    end
  end
end
