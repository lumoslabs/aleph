module PaginationSearch
  class BaseRelation
    def initialize(relation, params, attribute_set)
      @relation = relation
      @params = params
      @attribute_set = attribute_set
    end

    def process
      searched
      sorted
      @relation
    end

    private

    def searched
      return unless @params[:search].present?
      search_conditions = SearchConditions.process(@params[:search])
      search(search_conditions) unless search_conditions.nil?
    end

    def sorted
      order_type = @params[:sort_descending].to_bool ? :desc : :asc

      if @params[:sort_by].present? && sort_attr = @attribute_set[@params[:sort_by].to_sym]
        left_outer_join(sort_attr.association_name) if @attribute_set.foreign_attributes.include?(sort_attr)
        select(sort_attr.column)
        order(sort_attr.column.public_send(order_type))
      else
        select(:created_at)
        order(created_at: order_type)
      end
    end

    def search(search_conditions)
      if search_conditions.any_trait_search_terms.empty?
        join_tables_for_traits(search_conditions.single_trait_searches.keys)
      else
        join_all_tables
      end

      search_conditions.single_trait_searches.each do |search_trait, search_terms|
        if attribute = @attribute_set[search_trait.to_sym]
          search_terms.each { |term| where(attribute.matching_condition(term)) }
        end
      end

      search_conditions.any_trait_search_terms.each do |term|
        conditions = @attribute_set.text_attributes.map do |attribute|
          attribute.matching_condition(term)
        end
        where(conditions.inject { |acc, condition| acc.or(condition) })
      end
    end

    def join_all_tables
      @attribute_set.foreign_attributes.each do |attribute|
        left_outer_join(attribute.association_name)
      end
    end

    def join_tables_for_traits(traits)
      attributes_to_join = @attribute_set.foreign_attributes.select { |attribute| traits.include?(attribute.name.to_s) }
      attributes_to_join.each do |attribute|
        left_outer_join(attribute.association_name)
      end
    end

    def left_outer_join(association_name)
      @relation = @relation.includes(association_name).references(association_name)
    end

    %i(select where order).each do |method_name|
      define_method(method_name) do |condition|
        @relation = @relation.public_send(method_name, condition)
      end
    end
  end
end
