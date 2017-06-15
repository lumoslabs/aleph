require 'spec_helper'

describe QueryExecution do
  describe 'perform' do
    let(:result) { create(:result) }

    context 'when it takes longer than we want to wait for' do
      before do
        stub_const("QueryExecution::QUERY_TIMEOUT", 1) # 1(one) second
        stub_github_calls
        
        allow(Role).to receive(:configured_connections) { ['admin'] }
        allow(RedshiftConnectionPool).to receive_message_chain('instance.get') { sleep(2) }

        allow(result).to receive(:mark_failed!)
        allow(Result).to receive(:find) { result } # force #perform to fetch the same result
      end

      it 'marks the result as failed' do
        QueryExecution.perform(result.id, 'admin')
        expect(result).to have_received(:mark_failed!)
      end
    end
  end
end
