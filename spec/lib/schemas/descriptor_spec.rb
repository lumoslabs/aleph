require 'spec_helper'

describe Schemas::Descriptor do
  let(:query) do
    [
      {"table_schema"=>"incarnadine", "table_name"=>"drop_leaf", "column_name"=>"doric", "udt_name"=>"int8", "character_maximum_length"=>nil},
      {"table_schema"=>"gingerline", "table_name"=>"gateleg", "column_name"=>"ionic", "udt_name"=>"int8", "character_maximum_length"=>nil},
      {"table_schema"=>"pervenche", "table_name"=>"trestle_1", "column_name"=>"corinthian", "udt_name"=>"int4", "character_maximum_length"=>nil},
      {"table_schema"=>"pervenche", "table_name"=>"trestle_2", "column_name"=>"corinthian", "udt_name"=>"int4", "character_maximum_length"=>nil},
      {"table_schema"=>"verditer", "table_name"=>"refectory_1", "column_name"=>"tuscan", "udt_name"=>"varchar", "character_maximum_length"=>"36"},
      {"table_schema"=>"verditer", "table_name"=>"refectory_2", "column_name"=>"tuscan", "udt_name"=>"varchar", "character_maximum_length"=>"36"},
      {"table_schema"=>"verditer", "table_name"=>"poker", "column_name"=>"tuscan", "udt_name"=>"varchar", "character_maximum_length"=>"36"}
    ]
  end
  let(:filtered_query) do
    [
      {"table_schema"=>"incarnadine", "table_name"=>"drop_leaf", "column_name"=>"doric", "udt_name"=>"int8", "character_maximum_length"=>nil},
      {"table_schema"=>"gingerline", "table_name"=>"gateleg", "column_name"=>"ionic", "udt_name"=>"int8", "character_maximum_length"=>nil},
      {"table_schema"=>"pervenche", "table_name"=>"trestle_1", "column_name"=>"corinthian", "udt_name"=>"int4", "character_maximum_length"=>nil}
    ]
  end

  subject { described_class.new('admin') }

  describe '#refresh_schema' do
    before do
      allow_any_instance_of(described_class).to receive(:exec_schema_query).and_return(query)
    end

    context 'without blacklisted items' do
      before do
        stub_const("TABLE_BLACKLIST", false)
      end
      
      it 'returns all tables' do
        expect(subject.instance_eval { refresh_schema }).to eq(query)
      end
    end

    context 'with blacklisted items' do
      before do
        stub_const("TABLE_BLACKLIST", { "verditer"=>['poker', 'ref*'], "pervenche"=>['potato', 'trestle_2'] })
      end

      it 'returns filtered tables' do
        expect(subject.instance_eval { refresh_schema }).to eq(filtered_query)
      end
    end
  end
end
