require 'spec_helper'

module Interaction
  describe ResultCreation do
    let(:params) { { body: 'Select 1', parameters: {}, runner: create(:user) } }
    let(:interaction) { Interaction::ResultCreation.new(params) }
    let(:compiler_result) { instance_double('SQLCompiler::CompilerResult') }

    before do
      stub_github_calls
      allow(compiler_result).to receive_messages(
        effective_values: {},
        body: 'SELECT 2',
        error: nil
      )
      expect_any_instance_of(QueryVersion).to receive(:compile) { compiler_result }
    end

    describe '#execute' do
      subject { interaction.execute }

      context 'when no errors are generated during the result creation' do
        it 'returns a result object' do
          expect(subject.class).to eq(Result)
        end

        it "sets the result's status to enqueued by default" do
          expect(subject.status).to eq('enqueued')
        end

        it "sets the result's compiled_body to the CompilerResult's body" do
          expect(subject.compiled_body).to eq('SELECT 2')
        end

        context 'when parameters and body are passed in as params' do
          let(:parameters) { [{ 'name' => 'test', 'type' => 'raw', 'default' => '1' }] }
          let(:body) { 'SELECT {test}' }
          let(:params) { { body: body, parameters: parameters, runner: create(:user) } }

          it 'adds those parameters and body to an unpersisted query version' do
            expect(QueryVersion).to receive(:new).with(body: body, parameters: parameters).and_call_original
            subject
          end
        end

        context 'when substitution_values are passed in as params' do
          let(:substitution_values) { { test: 'some test value' } }
          let(:params) do
            { substitution_values: substitution_values, runner: create(:user) }
          end

          before do
            @qv = build(:query_version)
            expect(QueryVersion).to receive(:new) { @qv }
          end

          it 'sends those arguments to query_version#compile' do
            expect(@qv).to receive(:compile).
              with(substitution_values: substitution_values) { compiler_result }
            subject
          end
        end

        context 'when the query_version is persisted and a query_version_id is passed in' do
          let(:query_version) { create(:query_version) }
          let(:params) { { query_version_id: query_version.id, runner: create(:user) } }

          it 'sets itself as the associated query_version' do
            expect(subject.query_version).to eq(query_version)
          end
        end
      end

      context 'when there are errors in the result_creation interaction' do
        let(:error) do
          instance_double(
            'CompilableParameter::CompilerArgumentError',
            message: 'You cannot do that thing you tried to do'
          )
        end
        before do
          allow(compiler_result).to receive_messages(
            effective_values: {},
            body: 'SELECT 2',
            error: error
          )
        end

        it "adds any errors to the result_creation's errors" do
          subject
          expect(interaction.errors).to eq(['You cannot do that thing you tried to do'])
        end
      end
    end
  end
end
