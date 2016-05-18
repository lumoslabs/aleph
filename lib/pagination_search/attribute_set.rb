module PaginationSearch
  class AttributeSet
    Attribute = Struct.new(:name, :arel_table, :association_name, :column_name, :type) do
      def column
        arel_table[column_name]
      end

      def matching_condition(value)
        column.matches("%#{value}%")
      end
    end

    def initialize(base_class, attribute_locations)
      @base_class = base_class
      @attributes = {}
      build_attributes(attribute_locations)
    end

    def [](name)
      @attributes[name]
    end

    def foreign_attributes
      @attributes.values.select do |attribute|
        foreign?(attribute.association_name)
      end
    end

    def text_attributes
      @attributes.values.select do |attribute|
        text?(attribute.type)
      end
    end

    private

    def foreign?(association)
      association != :base
    end

    def text?(type)
      type == :text
    end

    def build_attributes(attribute_locations)
      attribute_locations.each do |key, value|
        arel_table = arel_table_for_association(value[:association])
        @attributes[key] = Attribute.new(key, arel_table, value[:association], value[:column], value[:type])
      end
    end

    def arel_table_for_association(association)
      if foreign?(association)
        table_name = @base_class.reflections[association.to_s].plural_name
        Arel::Table.new(table_name)
      else
        @base_class.arel_table
      end
    end
  end
end
