class SchemaCommentsController < ApplicationController
  respond_to :json
  before_filter :fetch_schema_comment, only: [:update, :destroy]

  def create
    respond_to do |format|
      format.json do
        schema_comment = SchemaComment.create(schema_comment_params)

        if schema_comment.errors.any?
          render json: { success: false, errors: schema_comment.errors }, status: :unprocessable_entity
        else
          render json: schema_comment
        end
      end
    end
  end

  def update
    respond_to do |format|
      format.json do
        @schema_comment.update(schema_comment_params)

        if @schema_comment.errors.any?
          render json: { success: false, errors: @schema_comment.errors }, status: :unprocessable_entity
        else
          render json: @schema_comment
        end
      end
    end
  end

  def destroy
    @schema_comment.destroy
    redirect_to queries_path
  end

  private

  def fetch_schema_comment
    @schema_comment = SchemaComment.find(params[:id])
  end

  def schema_comment_params
    params.permit(:table, :schema, :column, :target_type, :text).merge(user: current_user)
  end
end
