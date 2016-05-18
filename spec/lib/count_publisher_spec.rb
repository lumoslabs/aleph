require 'spec_helper'

describe CountPublisher do
  let(:rrrc) { instance_double('RedisResultRowCount') }
  let(:publisher) { CountPublisher.new(rrrc) }
  let(:row) { ['email@example.com', '1234567'] }
  let(:callbacks) { publisher.callbacks }
  let(:row_count) { CountPublisher::INCREMENT_SIZE }

  before do
    allow(rrrc).to receive(:increment_count_by)
    allow(rrrc).to receive(:expire)
  end

  describe '#callbacks' do
    it 'returns a hash of lambdas' do
      expect(callbacks.class).to eq(Hash)
      expect(callbacks[:during_execute].class).to eq(Proc)
    end

    context 'the during_execute callback' do
      context 'when the row count has reached the increment_size' do
        it 'it tells the counter to increment by the increment size' do
          callbacks[:during_execute].call(row, row_count)
          expect(rrrc).to have_received(:increment_count_by).with(CountPublisher::INCREMENT_SIZE)
        end

        it 'continues to tell the counter to increment by the increment size for each multiple of the increment size' do
          row_count = CountPublisher::INCREMENT_SIZE * 2
          callbacks[:during_execute].call(row, row_count)
          expect(rrrc).to have_received(:increment_count_by).with(CountPublisher::INCREMENT_SIZE)
        end
      end

      context 'before the row count has reached the increment_size' do
        let(:row_count) { CountPublisher::INCREMENT_SIZE - 100 }

        it 'it does not tell the counter to incremenet' do
          callbacks[:during_execute].call(row, row_count)
          expect(rrrc).not_to have_received(:increment_count_by)
        end
      end
    end

    context 'the after_execute callback' do
      it 'tells the counter to expire the count' do
        callbacks[:after_execute].call(row_count)
        expect(rrrc).to have_received(:expire)
      end
    end
  end
end
