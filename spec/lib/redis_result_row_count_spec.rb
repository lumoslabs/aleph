require 'spec_helper'

describe RedisResultRowCount do
  let(:rrrc) { RedisResultRowCount.new(create(:result)) }
  before do 
    stub_github_calls
  end

  describe '#ongoing_row_count' do
    context 'given there has been a row count incrementation' do
      subject { rrrc.ongoing_row_count }
      before { rrrc.increment_count_by(10) }

      it 'returns the current row count' do
        expect(subject.to_i).to eq(10)
      end
    end
  end

  describe '#increment_count_by' do
    it 'increments the row count by the passed amount' do
      rrrc.increment_count_by(20)
      expect(rrrc.ongoing_row_count.to_i).to eq(20)
      rrrc.increment_count_by(30)
      expect(rrrc.ongoing_row_count.to_i).to eq(50)
    end
  end

  describe '#expire' do
    subject { rrrc.expire }

    context 'given there has been a row count incrementation' do
      before { allow(Redis.current).to receive(:expire) }

      it 'expires the count' do
        subject
        expect(Redis.current).to have_received(:expire)
      end
    end

    context 'when there has not been a row count incrementation' do
      it 'does not error' do
        subject
      end
    end
  end
end
