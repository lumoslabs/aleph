require 'spec_helper'

FakeComment = Struct.new(:schema, :table, :column, :target_type, :id, :text, :user_id);

describe SchemaCommentMatcher do
  let(:comment_a) { FakeComment.new('views', 'visit_facts', 'user_id', 'int', 1, 'visit_facts.user_id rules', 666) }
  let(:comment_b) { FakeComment.new('warehouse', 'user_dimension', 'id', 'int', 100, 'this is actually a user_id', 666) }
  let(:comments) { [ comment_a, comment_b ] }
  let(:columns) do
    [
      { schema: 'views', table: 'visit_facts', column: 'user_id', type: 'int' },
      { schema: 'my_grepper', table: 'blerg', column: 'user_id', type: 'int' }
    ]
  end

  before do
    allow(SchemaComment).to receive(:all).and_return(comments)
  end

  describe '#load_cache' do
    before(:each) do
      described_class.load_cache
    end

    it 'loads @cache properly with the correct keys' do
      expect(described_class.instance_variable_get('@cache')).to eq({
        'views_visit_facts_user_id_int' => comment_a,
        'warehouse_user_dimension_id_int' => comment_b,
      })
    end
  end

  describe '#enrich' do
    before(:each) do
      described_class.enrich(columns)
    end

    it 'joins comments to columns, enriching the column object with the comment info' do
      expect(columns).to eq([
        {
          schema: 'views',
          table: 'visit_facts',
          column: 'user_id',
          type: 'int',
          :comment_text => 'visit_facts.user_id rules',
          :comment_user_id => 666,
          :comment_id => 1
        },
        {
          schema: 'my_grepper',
          table: 'blerg',
          column: 'user_id',
          type: 'int'
        },
      ])
    end
  end

end
