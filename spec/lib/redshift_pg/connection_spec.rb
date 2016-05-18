require 'spec_helper'

describe RedshiftPG::Connection do
  let(:PG) { instance_double('PG') }
  let(:pg_connection) { instance_double('PG::connection') }
  let(:config) do
    {
      'host' => 'somehost',
      'database' => 'somedb',
      'port' => '1234',
      'username' => 'bleh',
      'password' => 'xyzzzzz'
    }
  end
  subject { RedshiftPG::Connection.new(config) }

  before do
    allow(PG).to receive(:connect) { pg_connection }
    allow(pg_connection).to receive(:reset)
  end

  it 'sets the config correctly' do
    expect(subject.config).to eq(config)
  end

  describe '#pg_connection' do
    before do
      subject.pg_connection
    end

    it 'calls ::PG.connect with the properly transformed configs' do
      expected_config = {
        'host' => 'somehost',
        'dbname' => 'somedb',
        'port' => '1234',
        'user' => 'bleh',
        'password' => 'xyzzzzz'
      }
      expect(::PG).to have_received(:connect).with(expected_config)
    end

    it 'returns a PG::Connection' do
      expect(subject.pg_connection).to eq(pg_connection)
    end
  end

  describe '#reconnect_on_failure' do
    let(:dummy) { spy('dummy') }

    it 'yields the block' do
      subject.reconnect_on_failure do
        dummy.call
      end
      expect(dummy).to have_received(:call)
    end

    it 'returns the result of the yield' do
      result = subject.reconnect_on_failure do
        'yielded string'
      end
      expect(result).to eq('yielded string')
    end

    context 'if a pg connection error is raised in the block' do
      before do
        allow(subject.pg_connection).to receive(:reset)
        @raised = false
      end

      def raise_once(error)
        unless @raised
          @raised = true
          raise error
        end
      end

      it 'sends #reset to the connection and yields again' do
        subject.reconnect_on_failure do
          dummy.call
          raise_once(PG::UnableToSend)
        end
        expect(subject.pg_connection).to have_received(:reset)
        expect(dummy).to have_received(:call).exactly(2).times
      end

      it 'raises the error after a second failure' do
        expect do
          subject.reconnect_on_failure do
            dummy.call
            raise PG::UnableToSend
          end
        end.to raise_error(PG::UnableToSend)
        expect(dummy).to have_received(:call).exactly(2).times
      end
    end
  end
end
