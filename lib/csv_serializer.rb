# encoding: UTF-8

require 'csv'

class CsvSerializer
  def self.load(csv_string)
    # takes a CSV string, and returns an Array of Hashes
    # the keys are the column names and the values are the values.
    # keys and values will all be strings.

    csv_table = CSV.parse(csv_string.present? ? csv_string : '', headers: :first_row)
    csv_table.map { |csv_row| csv_row.to_hash }
  end

  def self.dump(data)
    # takes something that behaves like an Array of Hashes, and returns a CSV string.

    headers = data.try(:first).present? ? data.first.keys : []
    CSV.generate(headers: headers, write_headers: true) do |csv|
      data.try(:map) do |data_hash|
        csv << headers.map { |key| data_hash[key] }
      end
    end
  end

  def self.load_from_s3_file(key, num_rows=nil, headers=true)
    # load from an CSV file in s3 and returns the headers (if headers=true) and the rows in 2-D array
    # params:
    #   file: s3 key
    #   num_rows: maximum number of rows to return
    #   headers: does the csv file has a header row?
    #

    reader = AwsS3.pipe_reader(key)
    rows = []
    header_row = nil
    CSV.new(reader, headers: true, return_headers: true).each_with_index do |row, n|
      break if num_rows && n > num_rows

      if headers && n == 0
        header_row = row.fields
      else
        rows << row.fields
      end
    end

    return [header_row, rows]
  end
end
