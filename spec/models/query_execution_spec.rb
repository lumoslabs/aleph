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
      end

      it 'marks the result as failed' do
        expect_any_instance_of(Result).to receive(:mark_failed!)
        QueryExecution.perform(result.id, 'admin')
      end
    end
  end
end
