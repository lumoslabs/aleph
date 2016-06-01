module AlephExecutables
  class WebServer < CapitalistPig
    def execute!
      oppress!('web')
    end
  end
end
