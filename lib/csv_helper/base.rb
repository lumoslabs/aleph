require 'fileutils'
module CsvHelper
  class Base
    CSV_RESULTS_DIR = '/tmp'

    def initialize(result_id)
      @result_id = result_id
      @tmp_results_dir = File.join(Rails.root, CSV_RESULTS_DIR)
      FileUtils.mkdir_p(@tmp_results_dir)
    end

    def filepath
      File.join(@tmp_results_dir, filename)
    end

    def filename
      "#{@result_id}.csv"
    end
  end
end
