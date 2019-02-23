module Interaction
  class QueryUpdate
    include QueryInteraction

    def initialize(query, params)
      @errors = []
      @query = query
      @current_query_version = @query.version
      @params = params
      unpack_params
    end

    def execute
      @query.title = @title
      @query.tag_list = @tags
      @query.set_roles(@roles)
      @query.scheduled_flag = @scheduled_flag
      @query.email = @email

      @current_query_version.comment = @comment
      @current_query_version.save!

      next_query_version = nil
      if create_new_query_version?
        @query.latest_body = @body

        next_query_version = @query.query_versions.build(
          version: @query.latest_version + 1,
          body: @body,
          parameters: @parameters,
          user_id: @user.id
        )

        current_visualizations = @current_query_version.visualizations
        current_visualizations.reverse_each do |visualization|
          next_query_version.visualizations.build(
            title: visualization.title,
            html_source: visualization.html_source
          )
        end
      end

      @query.add_result(@result)
      @query.save
      merge_query_errors
      @query.reload

      # FIXME: ------------------------------------------------------------------------------------------
      #   @query.reload clobbers the version (an unpersisted field), so we need to re-set the version
      #   if we created a new version we will want to send back that new version
      #   otherwise, we want to set it back to the version that was passed in
      #   pretty hacky, will need to figure out a better solution
      # -------------------------------------------------------------------------------------------------
      @query.version = next_query_version || @current_query_version

      @result.copy_latest_result if @result.present?
      @query
    end

    def create_new_query_version?
      return false unless @params[:version]
      @current_query_version.body != @body || @current_query_version.parameters != @parameters
    end
  end
end
