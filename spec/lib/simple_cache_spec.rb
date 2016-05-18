require 'spec_helper'

describe SimpleCache do
  let(:klass) do
    Class.new(SimpleCache) do
      def new_object(key)
        "value_for_#{key}"
      end
    end
  end

  let(:key) { 'abc' }
  let(:value_for_key) { 'value_for_abc' }

  subject { klass.new }

  before do
    allow(subject).to receive(:new_object).and_call_original
  end

  context 'first time we try to #get for a key' do
    it 'generates the correct value for the key' do
      expect(subject.get(key)).to eq(value_for_key)
      expect(subject).to have_received(:new_object)
    end
  end

  context 'after we #get for a key' do
    before do
      subject.get(key)
    end

    it 'caches the value for key' do
      expect(subject.instance_variable_get('@cache')[key]).to eq(value_for_key)
    end

    it 'if called again, we use the cache value' do
      # call a few times for good measure
      subject.get(key)
      subject.get(key)
      expect(subject.get(key)).to eq(value_for_key)

      expect(subject).to have_received(:new_object).once
    end
  end
end
