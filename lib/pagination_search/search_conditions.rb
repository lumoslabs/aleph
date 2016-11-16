require 'csv'

module PaginationSearch
  class SearchConditions
    ALL_TRAIT_SEARCH_KEY  = ''.freeze
    MATCH_TYPE_KEY        = 'match_type'.freeze
    EXACT_MATCH           = 'exact'.freeze

    Result = Struct.new(:trait_term_hash) do
      def single_trait_searches
        trait_term_hash.reject { |trait, _term| [ALL_TRAIT_SEARCH_KEY, MATCH_TYPE_KEY].any? { |t| t == trait } }
      end

      def any_trait_search_terms
        trait_term_hash.fetch(ALL_TRAIT_SEARCH_KEY, [])
      end

      def match_type
        match_type_term = trait_term_hash[MATCH_TYPE_KEY]
        match_type_term.present? ? match_type_term.first : nil
      end

      def match_exact?
        match_type == EXACT_MATCH
      end
    end

    class << self
      def process(search_string)
        wrapped attribute_cleaned grouped separated search_string
      end

      private

      def wrapped(cleaned_grouped_hash)
        return nil if cleaned_grouped_hash.nil?
        Result.new(cleaned_grouped_hash)
      end

      def separated(search_string)
        CSV::parse_line(search_string, col_sep: ' ').compact
      rescue CSV::MalformedCSVError => mce
        nil
      end

      def grouped(terms)
        return nil if terms.nil?
        terms.group_by { |item| /.+?(?=:)/.match(item).to_s }.to_hash
      end

      def attribute_cleaned(grouped_hash)
        return nil if grouped_hash.nil?
        grouped_hash.each do |key, values|
          values.each { |value|  value.gsub!("#{key}:", '') }.compact
        end
      end
    end
  end
end
