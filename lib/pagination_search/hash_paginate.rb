require 'csv'
module PaginationSearch
  class HashPaginate
    def initialize(keys = nil)
      @keys = keys
    end

    def page(items, params)
      return [] unless items
      return items unless params[:limit] && params[:offset]

      length = params[:limit].to_i
      start = params[:offset].to_i * length

      search = params[:search]
      sort_by = params[:sort_by]
      sort_descending = params[:sort_descending]

      processed = process(items, search, sort_by, sort_descending)[start, length]
      processed ? processed : []
    end

    protected

    def process(items, search, sort_by, sort_descending)
      searched_items = searched(items, search)
      sorted_items = sorted(searched_items, sort_by)
      ordered(sorted_items, sort_descending)
    end

    def searched(items, search)
      search_conditions = PaginationSearch::SearchConditions.process(search) if search.present?

      if search_conditions
        items.select { |i| accept?(i, search_conditions) }
      else
        items
      end
    end

    def match(field, term, match_exact)
      f = field.to_s.downcase
      t = term.downcase
      match_exact ? f == t : f.include?(t)
    end

    def accept?(item, search_conditions)
      search_conditions.trait_term_hash.all? do |search_key, terms|
        if search_key == PaginationSearch::SearchConditions::ALL_TRAIT_SEARCH_KEY
          search_keys = @keys || item.keys
          terms.all? do |term|
            search_keys.any? do |k|
              match(item[k], term, search_conditions.match_exact?)
            end
          end
        elsif item.key?(search_key)
          val = item[search_key]
          terms.all? do |term|
            match(val, term, search_conditions.match_exact?)
          end
        else
          true
        end
      end
    end

    def sorted(items, sort_by)
      sort_by.present? ? items.sort_by { |i| i[sort_by] } : items
    end

    def ordered(items, sort_descending)
      sort_descending.to_bool ? items.reverse : items
    end
  end
end
