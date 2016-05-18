class VisualizationsController < ApplicationController
  include QueryVersionSupport

  respond_to :json, :html
  load_and_authorize_resource only: [:update, :destroy]
  before_filter :retrieve_query_version, if: -> { params[:query_id] }

  def index
    respond_to do |format|
      format.html
      format.json do
        @visualizations = @query_version.visualizations.accessible_by(current_ability)
        render json: @visualizations
      end
    end
  end

  def update
    respond_to do |format|
      format.json do
        @visualization.update(visualization_params)

        if @visualization.errors.any?
          render json: { success: false, errors: @visualization.errors.full_messages }, status: :unprocessable_entity
        else
          render json: @visualization
        end
      end
    end
  end

  def destroy
    respond_to do |format|
      format.json do
        @visualization.destroy
        render json: @visualization
      end
    end
  end

  def create
    respond_to do |format|
      format.json do
        visualization = Visualization.create(visualization_params)

        if visualization.errors.any?
          render json: { success: false, errors: visualization.errors.full_messages }, status: :unprocessable_entity
        else
          @query_version.visualizations << visualization
          render json: visualization, status: :created
        end
      end
    end
  end

  private

  def visualization_params
    params.permit(:html_source, :title)
  end
end
