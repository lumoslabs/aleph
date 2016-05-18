class CompilableParameter
  attr_reader :name, :type, :default_value

  class CompilerArgumentError < ArgumentError; end

  def initialize(option)
    option = option.stringify_keys
    @name = option['name']
    @type = option['type']
    @default_value = option['default']
  end

  def compile(provided_value)
    value = provided_value.blank? ? default_value : provided_value
    process(value)
  end

  private

  def process(value)
    case type
    when 'raw'
      value
    when 'string'
      as_string(value)
    when 'number'
      value.to_f.to_s
    when 'date'
      sql_cast(as_string(parse_time(value).strftime('%Y-%m-%d')), 'DATE')
    when 'timestamp'
      sql_cast(as_string(parse_time(value).utc.iso8601(3)), 'TIMESTAMP')
    else
      raise CompilerArgumentError, "Unknown parameter type #{type}"
    end
  end

  def parse_time(value)
    parsed = Chronic.parse(value)
    return parsed if parsed
    raise CompilerArgumentError, "Value #{value} is unparseable as time"
  end

  def as_string(raw)
    "'#{raw.gsub(/'/, '\'\'')}'"
  end

  def sql_cast(value, type)
    "(#{type} #{value})"
  end
end
