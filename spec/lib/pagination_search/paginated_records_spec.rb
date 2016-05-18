require 'spec_helper'

module PaginationSearch
  describe PaginatedRecords do
    let(:attribute_locations) { double('attribute_locations') }
    let(:base_class) { Query }
    let(:paginated_records) { PaginatedRecords.new(base_class, attribute_locations) }
    let(:base_relation) { Query.select(:id) }
    let(:base_relation_instance) { instance_double('BaseRelation', process: Query.select(:id)) }
    let(:params) { {} }

    before do
      allow(AttributeSet).to receive(:new) { instance_double('AttributeSet') }
      allow(BaseRelation).to receive(:new) { base_relation_instance }
    end

    describe 'on initialization' do
      it 'creates an AttributeSet' do
        expect(AttributeSet).to receive(:new)
        paginated_records
      end
    end

    describe '#page_for' do
      subject { paginated_records.page_for(base_relation, params) }

      it 'creates a new BaseRelation and calls process on it' do
        subject
        expect(BaseRelation).to have_received(:new)
        expect(base_relation_instance).to have_received(:process)
      end

      it 'returns an ActiveRecord relation with the ids selected' do
        expect(subject.class).to eq(Query::ActiveRecord_Relation)
        expect(subject.to_sql).to include("SELECT  \"queries\".\"id\"")
      end

      context 'when the params contain a limit and an offset' do
        let(:params) { { limit: 100, offset: 0 } }

        it 'returns an ActiveRecord relation with the limit and offset included' do
          expect(subject.to_sql).to include('LIMIT 100 OFFSET 0')
        end
      end
    end
  end
end
