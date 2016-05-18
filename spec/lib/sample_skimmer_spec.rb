require 'spec_helper'

describe SampleSkimmer do
  let(:num_sample_rows) { 2 }
  let(:callback) { ->(samples) { @samples = samples }  }
  let(:skimmer) { SampleSkimmer.new(num_sample_rows, &callback) }
  let(:row) { ['email@example.com', '1234567'] }
  let(:row_count) { 1 }
  let(:callbacks) { skimmer.callbacks }
  after { @samples = nil }

  describe '#callbacks' do
    it 'returns a hash of lambdas' do
      expect(callbacks.class).to eq(Hash)
      expect(callbacks[:during_execute].class).to eq(Proc)
    end

    context 'the during_execute callback' do
      it 'does not call the callback until num_sample_rows is reached' do
        callbacks[:during_execute].call(row, row_count)
        expect(@samples).to be_nil
      end

      it 'does calls the callback and adds the rows to the sample collection when the row count is below num_sample_rows' do
        callbacks[:during_execute].call(row, row_count)
        row_count = 2
        callbacks[:during_execute].call(row, row_count)
        expect(@samples.length).to eq(2)
      end

      it 'does not add rows to the sample collection if the row count is above num_sample_rows' do
        callbacks[:during_execute].call(row, row_count)
        row_count = 2
        callbacks[:during_execute].call(row, row_count)
        row_count = 3
        callbacks[:during_execute].call(row, row_count)
        expect(@samples.length).to eq(2)
      end
    end

    context 'the after_execute callback' do
      it 'calls the callback if it has not been called' do
        callbacks[:during_execute].call(row, row_count)
        callbacks[:after_execute].call(row_count)
        expect(@samples.first).to be(row)
      end

      it 'does not call the callback if it has already been called' do
        callbacks[:during_execute].call(row, row_count)
        row_count = 2
        callbacks[:during_execute].call(row, row_count)
        expect(@samples.first).to be(row)
        @samples = nil
        callbacks[:after_execute].call(row_count)
        expect(@samples).to be_nil
      end
    end
  end
end
