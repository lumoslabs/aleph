require 'spec_helper'

describe CsvSerializer do
  let(:array_of_hashes) do
    [
      {'original_language' => 'en', 'user_count' => '3'},
      {'original_language' => 'es', 'user_count' => '2'},
      {'original_language' => 'fr', 'user_count' => '1'}
    ]
  end

  let(:csv_string) { "original_language,user_count\nen,3\nes,2\nfr,1\n" }

  # the CSV class' default method of handling quoting and escaping is consistent with RFC4180: https://tools.ietf.org/html/rfc4180
  # - fields containing newlines, doublequotes, and/or commas are quoted with doublequotes
  # - doublequote characters within a field are represented by two doublequote characters

  let(:array_of_hashes_with_commas) { [{'foo' => 'value, with, commas'}] }
  let(:csv_string_with_commas) { "foo\n\"value, with, commas\"\n" }

  let(:array_of_hashes_with_newlines) { [{'foo' => "value\nwith\nlinebreaks"}] }
  let(:csv_string_with_newlines) { "foo\n\"value\nwith\nlinebreaks\"\n" }

  let(:array_of_hashes_with_quotes) { [{'foo' => "value \"with\" quotes"}] }
  let(:csv_string_with_quotes) { "foo\n\"value \"\"with\"\" quotes\"\n" }

  describe '.dump' do
    it 'transforms an array of hashes to a csv string' do
      expect(CsvSerializer.dump(array_of_hashes)).to eq(csv_string)
    end

    it 'puts doublequotes around fields containing commas' do
      expect(CsvSerializer.dump(array_of_hashes_with_commas)).to eq(csv_string_with_commas)
    end

    it 'puts doublequotes around fields containing newlines' do
      expect(CsvSerializer.dump(array_of_hashes_with_newlines)).to eq(csv_string_with_newlines)
    end

    it 'turns doublequotes within a field into two doublequotes' do
      expect(CsvSerializer.dump(array_of_hashes_with_quotes)).to eq(csv_string_with_quotes)
    end
  end

  describe '.load' do
    it 'transforms a csv string to an array of hashes' do
      expect(CsvSerializer.load(csv_string)).to eq(array_of_hashes)
    end

    it 'handles quoted fields containing commas' do
      expect(CsvSerializer.load(csv_string_with_commas)).to eq(array_of_hashes_with_commas)
    end

    it 'handles quoted fields containing newlines' do
      expect(CsvSerializer.load(csv_string_with_newlines)).to eq(array_of_hashes_with_newlines)
    end

    it 'turns two doublequotes with a field into a single doublequote' do
      expect(CsvSerializer.load(csv_string_with_quotes)).to eq(array_of_hashes_with_quotes)
    end
  end
end
