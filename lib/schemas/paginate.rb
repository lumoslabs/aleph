module Schemas
  class Paginate < PaginationSearch::HashPaginate
    protected

    def searched(items, search)
      search = expand_dot_notation(search) if /\A[A-z0-9]+\.[A-z0-9]+\z/ =~ search
      super(items, search)
    end

    def sorted(items, _)
      items.sort_by { |i| "#{i[:schema]}.#{i[:table]}.#{i[:column]}" }.reverse
    end

    private

    def expand_dot_notation(search)
      schema, table = search.split('.')
      "schema:#{schema} table:#{table} match_type:exact"
    end
  end
end
