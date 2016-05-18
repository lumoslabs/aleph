class SQLCompiler
  attr_accessor :parameters

  CompilerResult = Struct.new(:body, :effective_values, :error)

  def initialize(options)
    @body = options[:body]
    @parameter_reporters = options[:parameters]
  end

  def compile(substitution_values = {})
    compile!(substitution_values)
  rescue CompilableParameter::CompilerArgumentError => e
    CompilerResult.new(nil, nil, e)
  end

  def compile!(substitution_values = {})
    effective_values = get_effective_values(substitution_values)
    body = effective_values.inject(@body) do |body, (name, value)|
      body.gsub(/{\s*#{name}\s*}/) { value }
    end
    CompilerResult.new(body, effective_values)
  end

  protected

  def get_effective_values(substitution_values)
    substitution_values = substitution_values.stringify_keys
    @parameter_reporters.each_with_object({}) do |parameter_reporter, hash|
      hash[parameter_reporter.name] = parameter_reporter.compile(substitution_values[parameter_reporter.name])
    end
  end
end
