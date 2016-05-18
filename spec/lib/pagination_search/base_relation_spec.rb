require 'spec_helper'

module PaginationSearch
  describe BaseRelation do
    let(:relation) { Query.select(:id) }
    let(:title_attribute) do
      instance_double(
        'PaginationSearch::AttributeSet::Attribute',
        association_name: :query,
        name: :title,
        column: Arel::Table.new('queries')[:title]
      )
    end
    let(:tags_attribute) do
      instance_double(
        'PaginationSearch::AttributeSet::Attribute',
        association_name: :tags,
        name: :tags,
        column: Arel::Table.new('tags')[:name]
      )
    end
    let(:attribute_set) do
      instance_double(
        'PaginationSearch::AttributeSet',
        foreign_attributes: [tags_attribute],
        text_attributes: [tags_attribute, title_attribute]
      )
    end
    let(:params) { {} }
    let(:base_relation) { PaginationSearch::BaseRelation.new(relation, params, attribute_set) }

    before do
      allow(title_attribute).to receive(:matching_condition).with('test').and_return(
        Arel::Table.new('queries')[:title].matches('test')
      )
      allow(title_attribute).to receive(:matching_condition).with('weee').and_return(
        Arel::Table.new('queries')[:title].matches('weee')
      )
      allow(tags_attribute).to receive(:matching_condition).with('weee').and_return(
        Arel::Table.new('tags')[:name].matches('weee')
      )
      allow(tags_attribute).to receive(:matching_condition).with('test').and_return(
        Arel::Table.new('tags')[:name].matches('test')
      )
      allow(attribute_set).to receive(:[]).with(:title).and_return(title_attribute)
      allow(attribute_set).to receive(:[]).with(:tags).and_return(tags_attribute)
    end

    describe '#process' do
      subject { base_relation.process }

      context 'when the params are empty' do
        it 'produces an ActiveRecord relation which includes ordering by created_at of the base, ascending' do
          expect(subject.arel.orders.length).to eq(1)
          expect(subject.arel.orders.first.class).to eq(Arel::Nodes::Ascending)
          expect(subject.arel.orders.first.expr.name).to eq(:created_at)
        end
      end

      context 'when the params include sort_descending' do
        let(:params) { { sort_descending: true } }

        it 'produces an ActiveRecord relation which includes ordering by created_at of the base, descending' do
          expect(subject.arel.orders.length).to eq(1)
          expect(subject.arel.orders.first.class).to eq(Arel::Nodes::Descending)
          expect(subject.arel.orders.first.expr.name).to eq(:created_at)
        end
      end

      context 'when the params include another sort_by attribute' do
        let(:params) { { sort_by: 'tags' } }

        it 'produces an ActiveRecord relation which selects that attribute as well as the base ids' do
          expect(subject.arel.projections.length).to eq(2)
          select_columns = subject.arel.projections.map(&:name)
          select_tables = subject.arel.projections.map do |projection|
            projection.relation.name
          end
          expect(select_columns).to include(:name, :id)
          expect(select_tables).to include('queries', 'tags')
        end

        it 'produces an ActiveRecord relation which includes ordering by created_at of that attribute, ascending' do
          expect(subject.arel.orders.length).to eq(1)
          expect(subject.arel.orders.first.class).to eq(Arel::Nodes::Ascending)
          expect(subject.arel.orders.first.expr.relation.name).to eq('tags')
          expect(subject.arel.orders.first.expr.name).to eq(:name)
        end
      end

      context 'when the params include a search atribute on a single trait of the base object' do
        let(:params) { { search: 'title:test' } }

        it 'produces an ActiveRecord relation which includes a condition constraining that trait to that term' do
          expect(subject.to_sql).to include("queries\".\"title\" ILIKE 'test'")
        end
      end

      context 'when the params include a search atribute on a single trait of a foreign attribute' do
        let(:params) { { search: 'tags:test' } }

        it 'produces an ActiveRecord relation which includes a condition constraining that trait to that term' do
          expect(subject.to_sql).to include("tags\".\"name\" ILIKE 'test'")
        end

        it 'produces an ActiveRecord relation which left outer joins the foreign table' do
          expect(subject.to_sql).to include("LEFT OUTER JOIN \"tags\"")
        end
      end

      context 'when the params include a search atribute on any trait' do
        let(:params) { { search: 'weee' } }

        it 'produces an ActiveRecord relation which includes a condition constraining any trait to that term' do
          expect(subject.to_sql).to include("tags\".\"name\" ILIKE 'weee'")
          expect(subject.to_sql).to include("queries\".\"title\" ILIKE 'weee'")
        end

        it 'produces an ActiveRecord relation which left outer joins all foreign tables' do
          expect(subject.to_sql).to include("LEFT OUTER JOIN \"tags\"")
        end
      end
    end
  end
end
