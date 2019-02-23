module Interaction
  module QueryInteraction
    attr_reader :errors

    private

    def unpack_params
      @tags = @params[:tags] || []
      @title = @params[:title]
      @user = @params[:user]
      @scheduled_flag = !!@params[:scheduled_flag]
      @email = @params[:email]

      @result = fetch_result
      @roles = build_roles

      return unless @params[:version]
      @parameters = @params[:version][:parameters] || []
      @comment = @params[:version][:comment]
      @body = @params[:version][:body]
    end

    def build_roles
      roles = [@user.role]
      roles.concat(@params[:roles]) if @params[:roles]
      superior_roles = roles.map { |role| ROLE_HIERARCHY[role] }
      roles.concat(superior_roles).flatten.uniq.delete_if { |x| !x.present? }
    end

    def merge_query_errors
      @errors.concat(@query.errors.full_messages) if @query.errors.any?
    end

    def fetch_result
      Result.find_by_id(@params[:result_id]) if @params[:result_id]
    end
  end
end
