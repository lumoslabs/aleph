module PaginationSearch
  module Pagination
    def paginate_with(attribute_locations)
      @paginated_records = PaginatedRecords.new(self, attribute_locations)
    end

    def paginated(base_relation, params)
      pagination_ids = @paginated_records.page_for(base_relation, params).map(&:id)
      where(id: pagination_ids).includes(self::INCLUDES_MODELS).sort_by { |item| pagination_ids.find_index(item.id) }
    end
  end
end
