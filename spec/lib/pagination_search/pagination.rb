require 'spec_helper'

module PaginationSearch
  describe Pagination do
    class Query < ActiveRecord::Base
      extend PaginationSearch::Pagination
    end

    let(:attribute_locations) do
      {
        title:      { association: :base, column: :title, type: :text },
        body:       { association: :base, column: :latest_body, type: :text },
        author:     { association: :users, column: :name, type: :text },
        updated_at: { association: :base, column: :updated_at, type: :time }
      }
    end
    let(:pagination_includes) { [:users, :query_versions] }
    let(:base_relation) { Query.select(:id) }
    let(:query_result) { [double('page_for_result', id: 1)] }
    let(:paginated_records_instance) { instance_double('PaginatedRecords', page_for: query_result)  }
    let(:params) { {} }

    before do
      allow(PaginatedRecords).to receive(:new) { paginated_records_instance }
    end

    describe '.paginate_with' do
      subject { Query.paginate_with(attribute_locations, pagination_includes) }

      it 'creates a new PaginatedRecords instance' do
        expect(PaginatedRecords).to receive(:new).with(Query, attribute_locations)
        subject
      end
    end

    describe '.paginated' do
      subject { Query.paginated(base_relation, params) }
      before { Query.paginate_with(attribute_locations, pagination_includes) }

      it 'calls PaginatedRecords#page_for' do
        expect(paginated_records_instance).to receive(:page_for).with(base_relation, params)
        subject
      end

      it 'selects the records from the base class where they match the pagination_ids' do
        expect(Query).to receive(:where).with(id: [1]).and_call_original
        subject
      end

      it 'eager loads the pagination_includes models' do
        expect(Query).to receive(:where).with(id: [1]) { Query }
        expect(Query).to receive(:includes).with(*pagination_includes) { query_result }
        subject
      end

      it 'sorts the result of the ActiveRecord query' do
        expect(Query).to receive(:where).with(id: [1]) { Query }
        expect(Query).to receive(:includes).with(*pagination_includes) { query_result }
        expect(query_result).to receive(:sort_by)
        subject
      end
    end
  end
end
