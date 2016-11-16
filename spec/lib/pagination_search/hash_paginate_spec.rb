require 'spec_helper'

describe PaginationSearch::HashPaginate do
  let(:items) do
    [
      { 'id' => 1, 'x' => 'square', 'y' => 'hippo' },
      { 'id' =>  2, 'x' => 'circle', 'y' => 'triangle_monkey' },
      { 'id' =>  3, 'x' => 'triangle', 'y' => 'human' }
    ]
  end
  let(:page_limit) { 2 }
  let(:first_page) { { offset: 0, limit: page_limit } }
  let(:second_page) { { offset: 1, limit: page_limit } }

  subject { described_class.new([ 'x', 'y' ]) }

  describe '#page' do

    context 'with no search terms' do

      context 'when items is nil' do
        it 'returns empty array' do
          expect(subject.page(nil, first_page)).to eq([])
        end
      end

      context 'when asking for the 1st page' do
        it 'gets the 1st page' do
          expect(subject.page(items, first_page)).to eq([
            { 'id' => 1, 'x' => 'square', 'y' => 'hippo' },
            { 'id' =>  2, 'x' => 'circle', 'y' => 'triangle_monkey' }
          ])
        end
      end

      context 'when asking for the 2nd page' do
        it 'gets the 2nd page' do
          expect(subject.page(items, second_page)).to eq([
            { 'id' =>  3, 'x' => 'triangle', 'y' => 'human' }
          ])
        end
      end
    end

    context 'with search terms' do

      context 'when search term is for a particular field' do
        it 'only returns rows that satisfy the search' do
          expect(subject.page(items, first_page.merge(search: 'x:triangle'))).to eq([
            { 'id' =>  3, 'x' => 'triangle', 'y' => 'human' }
          ])
        end
      end

      context 'when search term is for any field' do
        it 'only returns rows that satisfy the search' do
          expect(subject.page(items, first_page.merge(search: 'triangle'))).to eq([
            { 'id' =>  2, 'x' => 'circle', 'y' => 'triangle_monkey' },
            { 'id' =>  3, 'x' => 'triangle', 'y' => 'human' }
          ])
        end
      end
    end

    context 'with sorting parameters' do
      it 'sorts correctly' do
        expect(subject.page(items, first_page.merge(sort_by: 'id', sort_descending: 'true'))).to eq([
          { 'id' =>  3, 'x' => 'triangle', 'y' => 'human' },
          { 'id' =>  2, 'x' => 'circle', 'y' => 'triangle_monkey' }
        ])

        expect(subject.page(items, second_page.merge(sort_by: 'id', sort_descending: 'true'))).to eq([
          { 'id' => 1, 'x' => 'square', 'y' => 'hippo' }
        ])
      end
    end

    context  'when search terms are not correctly formated' do
      it 'returns all items' do
        expect(subject.page(items, first_page.merge(search: '"triangle'))).to eq([
          {"id"=>1, "x"=>"square", "y"=>"hippo"}, 
          {"id"=>2, "x"=>"circle", "y"=>"triangle_monkey"}
        ])
      end
    end
  end
end
