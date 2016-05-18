require 'spec_helper'

describe Alert do
  let(:role) { 'admin' }
  let(:alert) { create(:alert) }

  before do
    stub_github_calls
  end

  describe 'on create' do
    subject { alert }

    it 'sets the status to "Pending"' do
      expect(subject.status).to eq('Pending')
    end
  end

  describe '.run_all' do
    before do
      3.times do
        create(:alert)
      end
      2.times do
        paused_alert = create(:alert)
        paused_alert.status = 'Paused'
        paused_alert.save!
      end
    end
    subject { Alert.run_all }

    it 'enqueues AlertExecution for all non-paused alerts' do
      expect(Resque).to receive(:enqueue).exactly(3).times
      subject
    end
  end

  describe '#run' do
    subject { alert.run }

    context 'when the status is not paused' do
      before do
        expect(Resque).to receive(:enqueue).with(
          AlertExecution,
          alert.id,
          FactoryGirl.attributes_for(:user)[:role]
        ) { true }
      end

      it 'enqueues a resque job if the status is not paused' do
        subject
      end
    end

    context 'when the status is paused' do
      before { expect(Resque).not_to receive(:enqueue).with(AlertExecution, alert.id, role) { true }  }

      it 'does not enqueue a resque job if the status is paused' do
        alert.status = 'Paused'
        subject
      end
    end
  end

  describe '#check_last_result' do
    let(:alert) { create(:previously_run_alert) }
    subject { alert.check_last_result }

    it 'sets the status to passing if the result does not meet the comparator and target conditions' do
      subject
      expect(alert.status).to eq('Passing')
    end

    context 'when the comparator-target conditions are met' do
      let(:mail_double) { double('Mail::Message') }
      before do
        alert.comparator = '<'
        alert.save!
        expect(AlertMailer).to receive(:alert_failing_email).with(alert) { mail_double }
        expect(mail_double).to receive(:deliver_now!) { true }
      end

      it 'sends the alert_failing email' do
        subject
      end

      it 'sets the status to failing' do
        subject
        expect(alert.status).to eq('Failing')
      end
    end

    context 'when the data returned from the query does not allow comparison' do
      let(:mail_double) { double('Mail::Message') }
      before do
        alert.last_alert_result.sample_data = [['1'], ['1']]
        alert.last_alert_result.save!
        expect(AlertMailer).to receive(:alert_failing_email).with(alert) { mail_double }
        expect(mail_double).to receive(:deliver_now!) { true }
      end

      it 'sends the alert_failing email' do
        subject
      end

      it 'sets the status to "Errored"' do
        subject
        expect(alert.status).to eq('Errored')
      end

      context 'when the data size is bad' do
        it 'adds an error message to the alert that explains the problem' do
          subject
          expect(alert.error_message).to eq('An alert result must return only a single row and a single column')
        end
      end

      context 'when the data type is bad' do
        before do
          alert.last_alert_result.sample_data = [['fun times']]
          alert.last_alert_result.save!
        end

        it 'adds an error message to the alert that explains the problem' do
          subject
          expect(alert.error_message).to eq('An alert must return a number')
        end

        it 'sets the status to "Errored"' do
          subject
          expect(alert.status).to eq('Errored')
        end
      end

      context 'when the query has errored' do
        before do
          alert.last_alert_result.sample_data = nil
          alert.last_alert_result.status = 'failed'
          alert.last_alert_result.error_message = 'You wrote a stupid query'
          alert.last_alert_result.save!
        end

        it 'adds an error message to the alert that explains the problem' do
          subject
          expect(alert.error_message).to eq('You wrote a stupid query')
        end

        it 'sets the status to "Errored"' do
          subject
          expect(alert.status).to eq('Errored')
        end
      end
    end
  end
end
