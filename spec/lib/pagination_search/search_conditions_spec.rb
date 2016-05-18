require 'spec_helper'

module PaginationSearch
  describe SearchConditions do
    let(:term_string) { 'fit test' }

    describe '.process' do
      subject { SearchConditions.process(term_string) }

      it 'returns a SearchConditionsResult object' do
        expect(subject.class).to eq(SearchConditions::Result)
      end

      context 'when term string contains an invalid string' do
        let(:term_string) { '"this is an unfinished string' }

        it 'returns nil' do
          expect(subject).to be_nil
        end
      end

      context 'when the term string contains a colon separated attribute-value pair' do
        let(:term_string) { 'title:fancy' }

        it %(returns a SearchConditionsResult with a single_trait_searches hash that has the colon prefix as the key,
          and colon suffix within an array as the value) do
          expect(subject.single_trait_searches).to eq('title' => ['fancy'])
        end
      end

      context %(when the term string contains more than one colon separated attribute-value pair
        with duplicate attribute names) do
        let(:term_string) { 'title:fancy title:query' }

        it %(returns a SearchConditionsResult with a single_trait_searches hash that has the colon prefix as the key,
          and colon suffixes both within an array as the value) do
          expect(subject.single_trait_searches).to eq('title' => %w(fancy query))
        end
      end

      context %(when the term string contains more than one colon separated
        attribute-value pair with different attribute names) do
        let(:term_string) { 'title:fancy body:fittest' }

        it %(returns a SearchConditionsResult with a single_trait_searches hash that has the colon prefix as the key,
          and colon suffixes both within an array the value) do
          expect(subject.single_trait_searches).to eq('title' => ['fancy'], 'body' => ['fittest'])
        end
      end

      context 'when the term string contains regular values' do
        let(:term_string) { 'conversion lifecycle' }

        it %(returns a SearchConditionsResult with an array matching the separate values
          as the any_trait_search_terms) do
          expect(subject.any_trait_search_terms).to eq(%w(conversion lifecycle))
        end
      end
    end
  end
end
