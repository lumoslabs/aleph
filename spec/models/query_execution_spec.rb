require 'spec_helper'

describe QueryExecution do
  describe 'perform' do
    let(:result) { create(:result) }

    context 'when there is an error' do
      before do
        stub_github_calls

        allow(Role).to receive(:configured_connections) { ['admin'] }
        allow(RedshiftConnectionPool).to receive_message_chain('instance.get').and_raise("boom")

        allow(result).to receive(:mark_failed!)
        allow(Result).to receive(:find) { result } # force #perform to fetch the same result
        allow_any_instance_of(CsvService).to receive(:clear_tmp_file)
      end

      it 'marks the result as failed' do
        expect { QueryExecution.perform(result.id, 'admin') }.to raise_error("boom")
        expect(result).to have_received(:mark_failed!)
      end

      it 'does not keep the csv' do
        expect_any_instance_of(CsvService).to receive(:clear_tmp_file)
        expect { QueryExecution.perform(result.id, 'admin') }.to raise_error("boom")
      end
    end
  end
end
