require 'spec_helper'

describe CompilableParameter do
  let(:name) { 'name' }
  let(:default_value) { 'zxcv' }
  let(:now) { '2012-12-01T01:05:00.000Z' }
  subject { described_class.new({ 'name' => name, 'type' => type, 'default' => default_value }) }

  def typecast(string)
    "(#{type.upcase} '#{string}')"
  end

  around do |example|
    Timecop.freeze(now) do
      example.run
    end
  end

  describe 'raw parameters' do
    let(:type) { 'raw' }

    it 'should pass through verbatim when parsing' do
      expect(subject.compile('asdf')).to eq('asdf')
    end
  end

  describe 'string parameters' do
    let(:type) { 'string' }

    it 'should quote when compiling' do
      expect(subject.compile('asdf')).to eq('\'asdf\'')
    end

    it 'should escape quotes inside the string' do
      expect(subject.compile('\'')).to eq("''''")
    end
  end

  describe 'number parameters' do
    let(:type) { 'number' }
    it 'should compile integer strings to string representation fo floats' do
      expect(subject.compile('1')).to eq('1.0')
    end

    it 'should compile float strings to string representation of floats' do
      expect(subject.compile('3.5')).to eq('3.5')
    end
  end

  describe 'date parameters' do
    let(:type) { 'date' }
    let(:base_date) { '2012-12-12' }
    let(:one_day_ago) { '2012-12-11' }
    let(:now) { base_date }

    it 'should compile dates to typecasted strings' do
      expect(subject.compile(base_date)).to eq("(DATE '#{base_date}')")
      expect(subject.compile(base_date)).to eq(typecast(base_date))
    end

    it 'should compile logical dates properly' do
      expect(subject.compile('one day ago')).to eq("(DATE '#{one_day_ago}')")
      expect(subject.compile('one day ago')).to eq(typecast(one_day_ago))
    end
  end

  describe 'timestamp paramters' do
    let(:type) { 'timestamp' }
    let(:one_hour_ago) { '2012-12-01T00:05:00.000Z' }

    it 'should compile times to typecasted strings' do
      expect(subject.compile(now)).to eq(typecast(now))
    end

    it 'should compile logical timestamps to typecasted strings' do
      expect(subject.compile('one hour ago')).to eq(typecast(one_hour_ago))
    end
  end

  describe 'parameters in general' do
    let(:type) { 'raw' }

    it 'should use the default value when compiling with nil' do
      expect(subject.compile(nil)).to eq(default_value)
    end

    it 'should use the default value when compiling with a blank string' do
      expect(subject.compile('')).to eq(default_value)
    end

    it 'should otherwise use the value provided' do
      expect(subject.compile('anything')).to eq('anything')
    end
  end
end
