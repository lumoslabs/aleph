require 'spec_helper'

describe AlertExecution do
  let(:role) { 'admin' }
  let (:alert) { create(:alert) }
  let(:result) { create(:result) }
  let(:interaction) { instance_double('Interaction::ResultCreation') }

  before do
    stub_github_calls
    expect(QueryExecution).to receive(:perform)
    expect(Interaction::ResultCreation).to receive(:new) { interaction }
    expect(interaction).to receive(:execute) { result }
    expect(interaction).to receive(:errors) { [] }
    expect_any_instance_of(Alert).to receive(:check_last_result)
  end

  describe '.perform' do
    subject { AlertExecution.perform(alert.id, role) }

    it 'adds a result as the last_alert_result' do
      subject
      expect(alert.reload.last_alert_result.id).to be_truthy
    end

    it 'sets the status of the alert to "Pending"' do
      subject
      expect(alert.reload.status).to eq("Pending")
    end

    it 'calls QueryExecution.perform and alert.check_last_result' do
      subject
    end
  end
end
