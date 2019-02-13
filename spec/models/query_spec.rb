require 'spec_helper'

describe Query do
  let (:query) { create(:query) }

  before do
    stub_github_calls
  end

  describe 'validation' do
    context 'when the query has no title' do
      it 'should not be valid' do
        expect(build(:no_title_query)).to_not be_valid
      end
    end

    context 'when title has carriage returns' do
      it 'should not be valid' do
        expect(build(:carriage_return_title_query)).to_not be_valid
      end
    end

    context 'when latest_body is blank' do
      it 'should be valid' do
        expect(build(:no_latest_body_query)).to_not be_valid
      end
    end

    context 'when latest_body has carriage returns' do
      it 'should not be valid' do
        expect(build(:carriage_return_body_query)).to_not be_valid
      end
    end

    context 'with a valid query' do
      it 'should be valid' do
        expect(build(:query)).to be_valid
      end
    end
  end

  describe 'QueryUpdate-ing' do
    let (:new_title) { 'super cool new title' }
    let (:query_version) { build(:query_version) }
    let (:query_version_body) { 'a body' }

    before do
      allow_any_instance_of(Interaction::QueryUpdate).to receive(:fetch_version) { query_version }
      allow_any_instance_of(QueryVersion).to receive(:body) { query_version_body }
    end

    context 'when updating title' do
      before do
        Interaction::QueryUpdate.new(
          query,
          title: new_title,
          tags: [{ name: 'lifecycle', id: 1 }, { name: 'analytics', id: 2 }],
          version: {
            body: query_version_body,
            parameters: []
          },
          user: query_version.user,
          scheduled_flag: false
        ).execute
      end

      it 'should update the query title' do
        expect(query.title).to eq(new_title)
      end

      it 'should not create a new query version' do
        expect(query.query_versions.size).to eq(1)
        expect(query.latest_version).to eq(1)
      end
    end

    context 'without a body' do
      let(:update) do
        Interaction::QueryUpdate.new(
          query,
          title: new_title,
          tags: [{ name: 'lifecycle', id: 1 }, { name: 'analytics', id: 2 }],
          version: {
            parameters: []
          },
          user: query_version.user,
          scheduled_flag: false
        )
      end

      it 'should not create a new query version and add errors to the interaction' do
        query = update.execute
        expect(update.errors.any?).to be_truthy
        expect(query.query_versions.size).to eq(1)
        expect(query.latest_version).to eq(1)
      end
    end

    context 'with the same body' do
      before do
        Interaction::QueryUpdate.new(
          query,
          title: new_title,
          tags: [{ name: 'lifecycle', id: 1 }, { name: 'analytics', id: 2 }],
          version: {
            body: query_version_body,
            parameters: []
          },
          user: query_version.user,
          scheduled_flag: false
        ).execute
      end

      it 'should not create a new query version' do
        expect(query.query_versions.size).to eq(1)
        expect(query.latest_version).to eq(1)
      end
    end

    context 'with :body in params' do
      let (:new_body) { "select 'hihihi'" }
      before do
        Interaction::QueryUpdate.new(
          query,
          title: query.title,
          tags: [{ name: 'lifecycle', id: 1 }, { name: 'analytics', id: 2 }],
          version: {
            body: new_body,
            parameters: []
          },
          user: query_version.user,
          scheduled_flag: false
        ).execute
      end

      it 'should update the body and create new version' do
        expect(query.query_versions.size).to eq(2)
        expect(query.latest_version).to eq(2)
      end

      it 'should update the latest_body attr of the query' do
        expect(query.latest_body).to eq(new_body)
      end
    end

    context 'with :parameters in params' do
      let (:new_parameters) { [{'name' => 'some_parameter', 'type' => 'raw', 'default' => '10'}] }
      before do
        Interaction::QueryUpdate.new(
          query,
          title: query.title,
          tags: [{ name: 'lifecycle', id: 1 }, { name: 'analytics', id: 2 }],
          version: {
            body: query_version_body,
            parameters: new_parameters
          },
          user: query_version.user,
          scheduled_flag: false
        ).execute
      end

      it 'should create new version' do
        expect(query.query_versions.size).to eq(2)
        expect(query.latest_version).to eq(2)
      end

      it 'should set the parameters properly on the latest version' do
        expect(query.latest_query_version.parameters).to eq(new_parameters)
      end
    end

    context 'with scheduled_flag true' do
      before do
        Interaction::QueryUpdate.new(
          query,
          title: new_title,
          tags: [{ name: 'lifecycle', id: 1 }, { name: 'analytics', id: 2 }],
          version: {
            body: query_version_body,
            parameters: []
          },
          user: query_version.user,
          scheduled_flag: true
        ).execute
      end

      it 'should set scheduled_flag to true' do
        expect(query.scheduled_flag).to eq(true)
      end
    end

    context 'with email' do
      before do
        Interaction::QueryUpdate.new(
          query,
          title: new_title,
          tags: [{ name: 'lifecycle', id: 1 }, { name: 'analytics', id: 2 }],
          version: {
            body: query_version_body,
            parameters: []
          },
          user: query_version.user,
          scheduled_flag: false,
          email: 'odb@wu.tang'
        ).execute
      end

      it 'should set email correctly' do
        expect(query.email).to eq('odb@wu.tang')
      end
    end
  end
end
