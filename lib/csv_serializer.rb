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
end
