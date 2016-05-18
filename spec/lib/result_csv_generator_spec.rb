require 'spec_helper'
require 'csv'

describe ResultCsvGenerator do
  let(:result_id) { 1 }
  let(:headers) { ['email', 'id'] }
  let(:generator) { ResultCsvGenerator.new(result_id, headers) }
  let(:row) { ['email@example.com', '1234567'] }
  let(:row_count) { 1 }
  let(:callbacks) { generator.callbacks }
  before { FileUtils.mkdir_p(File.join(Rails.root, '/tmp')) }

  describe '#callbacks' do
    it 'returns a hash of lambdas' do
      expect(ResultCsvGenerator.new(result_id, headers).callbacks.class).to eq(Hash)
      expect(ResultCsvGenerator.new(result_id, headers).callbacks[:before_execute].class).to eq(Proc)
    end

    context 'the before_execute callback' do
      after { File.delete(generator.filepath) }

      it "opens a csv at the generator's filepath" do
        callbacks[:before_execute].call
        expect(File.exist?(generator.filepath)).to be_truthy
      end
    end

    context 'the during_execute callback, given the before_execute callback has been called' do
      before do
        callbacks[:before_execute].call
        callbacks[:during_execute].call(row, row_count)
        callbacks[:during_execute].call(row, row_count)
        generator.csv.close
      end
      after { File.delete(generator.filepath) }

      it "adds a row to the csv for each call it receives, plus one for the headers" do
        csv_data = CSV.read(generator.filepath)
        expect(csv_data.length).to eq(3)
      end

      it 'adds the headers first' do
        csv_data = CSV.read(generator.filepath)
        expect(csv_data.first).to eq(headers)
      end

      it 'adds the actual data that was passed' do
        csv_data = CSV.read(generator.filepath)
        expect(csv_data.last).to eq(row)
      end
    end

    context 'the after_execute callback, given the first two callbacks have been called' do
      before do
        callbacks[:before_execute].call
        callbacks[:during_execute].call(row, row_count)
        callbacks[:during_execute].call(row, row_count)
        expect_any_instance_of(CsvService).to receive(:store!)
      end

      it 'tells CsvService to store the csv' do
        callbacks[:after_execute].call(row_count)
      end

      it 'closes and removes the csv' do
        callbacks[:after_execute].call(row_count)
        expect(File.exist?(generator.filepath)).to be_falsey
      end
    end
  end
end
