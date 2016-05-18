module Interaction
  class QueryCreation
    include QueryInteraction

    def initialize(params)
      @errors = []
      @params = params
      unpack_params
    end

    def execute
      @query = Query.new(title: @title, latest_body: @body)
      @query.tag_list = @tags
      @query.set_roles(@roles)
      @query.query_versions.build(
        version: 1,
        body: @body,
        parameters: @parameters,
        user_id: @user.id
      )
      @query.add_result(@result)
      @query.save
      merge_query_errors
      @query
    end
  end
end
