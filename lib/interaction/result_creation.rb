module Interaction
  class ResultCreation
    attr_accessor :errors

    def initialize(params)
      @errors = []
      @substitution_values = params[:substitution_values]
      @owner = params[:owner]
      @query_version = get_query_version(params)
    end

    def execute
      compiler_result = @query_version.compile(substitution_values: @substitution_values)

      if compiler_result.error
        @errors << compiler_result.error.message
        return
      end

      result = Result.new(
        status: 'enqueued',
        parameters: compiler_result.effective_values,
        compiled_body: compiler_result.body,
        owner: @owner
      )

      result.query_version = @query_version if @query_version.persisted?

      result.save
      @errors << result.errors.full_messages if result.errors.any?

      result
    end

    private

    def get_query_version(params)
      case params[:query_version_id]
      when 'latest'
        QueryVersion.where(query_id: params[:query_id]).order('version DESC').limit(1)
      when nil
        QueryVersion.new(body: params[:body], parameters: params[:parameters] || {})
      else
        QueryVersion.find(params[:query_version_id])
      end
    end
  end
end
