require 'spec_helper'

describe Schemas::RedisStore do
  let(:redis) { instance_double('Redis.current') }
  let(:schema_rows) { [{ 'a' => '1' }, { 'b' => '2' }] }
  let(:json_schema_rows) { "[{\"a\":\"1\"},{\"b\":\"2\"}]" }
  let(:expire) { 666 }
  let(:including_class) do
    Class.new do
      include Schemas::RedisStore

      def key
        'test_key'
      end
    end
  end
  subject { including_class.new }

  before do
    # stub Redis
    allow(Redis).to receive(:current) { redis }

    # stub the Redis instance
    allow(redis).to receive(:set)
    allow(redis).to receive(:del)
    allow(redis).to receive(:expire)

    # stub JSON
    allow(JSON).to receive(:generate) { json_schema_rows }
    allow(JSON).to receive(:parse) { schema_rows }
  end

  describe '#store!' do
    before do
      subject.redis_store!(schema_rows)
    end

    it 'deletes the key and then json serializes the rows and then sets it in redis and then sets the expiry' do
      expect(redis).to have_received(:del).with('test_key').ordered
      expect(JSON).to have_received(:generate).with(schema_rows).ordered
      expect(redis).to have_received(:set).with('test_key', json_schema_rows).ordered
      expect(redis).to have_received(:expire).with('test_key', Schemas::RedisStore::EXPIRE).ordered
    end
  end

  describe '#retrieve' do
    retrieved = nil

    context 'when redis contains data for the key' do
      before do
        allow(redis).to receive(:get) { json_schema_rows }
        retrieved = subject.redis_retrieve
      end

      it 'retrieves the schema_row with the proper key' do
        expect(redis).to have_received(:get).with('test_key')
        expect(JSON).to have_received(:parse).with(json_schema_rows)
        expect(retrieved).to eq(schema_rows)
      end
    end

    context 'when redis does not contain data for the key' do
      before do
        allow(redis).to receive(:get) { nil }
        retrieved = subject.redis_retrieve
      end

      it 'does not attempt to json parse nil and returns an empty array' do
        expect(redis).to have_received(:get).with('test_key')
        expect(JSON).not_to have_received(:parse).with(json_schema_rows)
        expect(retrieved).to eq([])
      end
    end
  end
end
