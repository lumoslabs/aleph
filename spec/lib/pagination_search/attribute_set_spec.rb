require 'spec_helper'

module PaginationSearch
  describe AttributeSet do
    let(:base_class) { Query }
    let(:attribute_locations) do
      {
        title:      { association: :base, column: :title, type: :text },
        body:       { association: :base, column: :latest_body, type: :text },
        author:     { association: :users, column: :name, type: :text },
        updated_at: { association: :base, column: :updated_at, type: :time }
      }
    end
    let(:attribute_set) { AttributeSet.new(base_class, attribute_locations) }

    describe '#[]' do
      it 'returns an Attribute object' do
        expect(attribute_set[:title].class).to eq(AttributeSet::Attribute)
      end

      it %(returns the attribute that represents the values of the attribute_locations hash key
        corresponding to the passed name) do
        expect(attribute_set[:title].column_name).to eq(:title)
      end
    end

    describe '#foreign_attributes' do
      it 'returns the atrributes which are not on the base model' do
        expect(attribute_set.foreign_attributes.length).to eq(1)
        expect(attribute_set.foreign_attributes.first.name).to eq(:author)
      end
    end

    describe '#text_attributes' do
      it 'returns the atrributes which are text' do
        expect(attribute_set.text_attributes.length).to eq(3)
        expect(attribute_set.text_attributes.map(&:name)).to include(:title, :body, :author)
        expect(attribute_set.text_attributes.map(&:name)).not_to include(:updated_at)
      end
    end

    describe 'Attribute' do
      let(:local_time_attribute)   { attribute_set[:updated_at] }
      let(:foreign_text_attribute) { attribute_set[:author] }

      describe '#arel_table' do
        it 'returns an Arel::Table that represents that attribute' do
          expect(local_time_attribute.arel_table.class).to eq(Arel::Table)
          expect(local_time_attribute.arel_table.name).to eq('queries')
        end
      end

      describe '#column' do
        it "returns an Arel::Attribute that represents that attribute's column" do
          expect(local_time_attribute.column.class).to eq(Arel::Attributes::Attribute)
          expect(local_time_attribute.column.name).to eq(:updated_at)
        end
      end

      describe '#matching_condition' do
        it %(returns an Arel::Nodes::Matches object that has a matching value
           of the passed argument between wildcards) do
          expect(local_time_attribute.matching_condition('weee').class).to eq(Arel::Nodes::Matches)
          expect(local_time_attribute.matching_condition('weee').right.val).to eq('%weee%')
        end
      end
    end
  end
end
