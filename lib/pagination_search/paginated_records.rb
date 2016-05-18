module PaginationSearch
  class PaginatedRecords
    def initialize(base_class, attribute_locations)
      @attribute_set = AttributeSet.new(base_class, attribute_locations)
    end

    def page_for(relation, params)
      id_relation = relation.select(:id)

      length = params[:limit].to_i
      start = params[:offset].to_i * length

      BaseRelation.new(id_relation, params, @attribute_set).process.limit(length).offset(start)
    end
  end
end
