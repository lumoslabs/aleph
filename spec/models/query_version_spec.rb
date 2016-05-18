require 'spec_helper'

describe QueryVersion do
  before do
    stub_github_calls
  end

  describe 'validation' do
    context 'without a version number' do
      it 'should be invalid' do
        expect(build(:no_version_query_version)).to_not be_valid
      end
    end

    context 'without a parent query' do
      it 'should be invalid' do
        expect(build(:no_query_query_version)).to_not be_valid
      end
    end
  end

  describe '#compile' do
    before { allow_any_instance_of(QueryVersion).to receive(:get_body) { 'Select 2' } }
    subject { build(:query_version).compile }

    it 'returns a CompilerResult' do
      expect(subject.class).to eq(SQLCompiler::CompilerResult)
    end

    context 'when the query_version has parameters' do
      subject do
        build(
          :query_version,
          parameters: [{ 'name' => 'test', 'type' => 'raw', 'default' => '1' }],
          body: 'SELECT {test}'
        ).compile
      end

      it "compiles them as the result's compiled_body" do
        expect(subject.body).to eq('SELECT 1')
      end
    end
  end
end
