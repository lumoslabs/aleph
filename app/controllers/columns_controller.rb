class ColumnsController < ApplicationController
  respond_to :json

  def index
    respond_to do |format|
      if Role.configured_connections.include?(current_user.role)
        items = Schemas::Descriptors.instance.get(current_user.role).columns
        SchemaCommentMatcher.enrich(items) if params[:with_comments]
        format.json { render json: JSON.pretty_generate(paginate(items)) }
      else
        format.json { head :ok }
      end
    end
  end

  private

  def paginate(items)
    Schemas::Paginate.new([:schema, :table, :column, :comment_text]).page(items, params)
  end
end
