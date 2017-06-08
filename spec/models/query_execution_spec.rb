require 'spec_helper'

describe QueryExecution do
  describe 'perform' do
    let(:result) { create(:result) }

    context 'when it takes longer than we want to wait for' do
      before do
        stub_github_calls
        allow(Role).to receive(:configured_connections) { ['admin'] }
        allow(RedshiftConnectionPool).to receive_message_chain('instance.get') { sleep(2) }
        APP_CONFIG['query_timeout'] = 1 # 1(one) second
      end

      it 'times out if it takes too long' do
        expect(QueryExecution.perform(result.id, 'admin')).to raise_error(Timeout::Error)
      end
    end
  end
end
