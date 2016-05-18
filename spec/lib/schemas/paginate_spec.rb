require 'spec_helper'

describe Schemas::Paginate do
  let(:items) do
    [
      { 'schema' => 'red', 'table' => 'chair' },
      { 'schema' => 'reddish', 'table' => 'chair' },
      { 'schema' => 'blue', 'table' => 'table' }
    ]
  end
  let(:page_limit) { 3 }
  let(:page) { { offset: 0, limit: page_limit } }

  subject { described_class.new(['schema', 'table']) }

  describe '#page' do
    context 'with dot notation search terms' do
      it 'only returns rows that satisfy the search' do
        expect(subject.page(items, page.merge(search: 'red.chair'))).to eq([
          { 'schema' => 'red', 'table' => 'chair' }
        ])
      end
    end
  end
end
