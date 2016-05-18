require 'fileutils'
module CsvHelper
  class Local < Base
    attr_reader :url
    LOCAL_RESULT_CSV = 'local_result_csvs'

    def initialize(result_id)
      super(result_id)
      @url = File.join(LOCAL_RESULT_CSV, filename)
    end

    def store!
      FileUtils.copy(filepath, File.join('public', @url))
    end
  end
end
