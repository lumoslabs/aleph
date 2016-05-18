require 'spec_helper'

describe SQLCompiler do

  describe 'substitution' do
    let (:compilable_parameters) do
      [
        CompilableParameter.new({ 'name' => 'a', 'type' => 'raw', 'default' => 'red' }),
        CompilableParameter.new({ 'name' => 'b', 'type' => 'raw', 'default' => 'bull' }),
      ]
    end

    subject { SQLCompiler.new(body: '{ a } { b }', parameters: compilable_parameters) }

    it 'uses defaults if they are what\'s available' do
      expect(subject.compile({}).body).to eq('red bull')
    end

    it 'mixes defaults with specified values' do
      expect(subject.compile(a: 'green').body).to eq('green bull')
    end

    it 'prefers specified values' do
      expect(subject.compile(a: 'green', b: 'dragon').body).to eq('green dragon')
    end
  end
end
