require 'fileutils'
module CsvHelper
  class Local < Base
    attr_reader :url
    LOCAL_RESULT_CSV = 'local_result_csvs'

    def initialize(result_id)
      super(result_id)
      FileUtils.mkdir_p(File.join('public', LOCAL_RESULT_CSV))
      @url = File.join(LOCAL_RESULT_CSV, filename)
      @local_url = File.join('public', @url)
    end

    def store!
      FileUtils.copy(filepath, @local_url)
    end
  end
end
