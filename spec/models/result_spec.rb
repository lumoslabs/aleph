require 'spec_helper'

describe Result do
  let(:result) { create(:result) }
  let(:rrrc) { instance_double('RedisResultRowCount') }

  before do
   stub_github_calls
   allow(RedisResultRowCount).to receive(:new) { rrrc }
   allow(rrrc).to receive(:ongoing_row_count)
  end

  describe '#redis_result_row_count' do
    subject { result.redis_result_row_count }

    it 'creates an instance of a RedisResultRowCount' do
      expect(subject).to eq(rrrc)
    end
  end

  describe '#row_count' do
    subject { result.row_count }
    before { allow(Redis.current).to receive(:get) }

    context 'when the result has a row_count in the db' do
      before do
        result.row_count = 1
        result.save!
        result.reload
      end

      it 'returns that row count and does ask the counter' do
        expect(rrrc).not_to receive(:ongoing_row_count)
        expect(subject).to eq(1)
      end
    end

    context 'when the result does not have a row_count in the db' do
      it 'asks the counter for the row count' do
        expect(rrrc).to receive(:ongoing_row_count)
        subject
      end
    end
  end
end
