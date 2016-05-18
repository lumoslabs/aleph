module CsvHelper
  class Base
    CSV_RESULTS_DIR = '/tmp'

    def initialize(result_id)
      @result_id = result_id
    end

    def filepath
      File.join(Rails.root, CSV_RESULTS_DIR, filename)
    end

    def filename
      "#{@result_id}.csv"
    end
  end
end
