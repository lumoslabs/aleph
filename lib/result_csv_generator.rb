require 'csv'

class ResultCsvGenerator
  attr_accessor :csv

  def initialize(result_id, headers)
    @result_id = result_id
    @headers = headers
    @csv_service = CsvService.new(@result_id)
  end

  def callbacks
    {
      before_execute: setup_csv,
      during_execute: ->(row, _row_count) { @csv << row },
      after_execute: finish_csv
    }
  end

  def filepath
    @csv_service.filepath
  end

  private

  def setup_csv
    lambda do
      @csv = CSV.open(filepath, 'w')
      @csv << @headers
    end
  end

  def finish_csv
    lambda do |_row_count|
      @csv.close
      @csv_service.store!
      File.delete(filepath)
    end
  end
end
