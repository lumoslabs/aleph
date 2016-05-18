class QueriesController < ApplicationController
  respond_to :html, :json

  load_and_authorize_resource only: [:index, :show, :update, :destroy]
  before_filter :set_query_version, only: [:show]
  before_filter :set_query_version_from_query, only: [:update]

  def index
    respond_to do |format|
      format.html
      format.json do
        @paginated_queries = Query.paginated(@queries, query_pagination_params)
        render json: @paginated_queries, each_serializer: QueryIndexSerializer
      end
    end
  end

  def show
    respond_to do |format|
      format.html { render :index }
      format.json { render json: @query }
    end
  end

  def create
    respond_to do |format|
      format.json do
        interaction = Interaction::QueryCreation.new(params[:query].merge(user: current_user))
        @query = interaction.execute

        if interaction.errors.any?
          render json: { success: false, errors: interaction.errors }, status: :unprocessable_entity
        else
          render json: @query, status: :created
        end
      end
    end
  end

  def update
    respond_to do |format|
      format.json do
        interaction = Interaction::QueryUpdate.new(@query, params[:query].merge(user: current_user))
        updated_query = interaction.execute

        if interaction.errors.any?
          render json: { success: false, errors: interaction.errors }, status: :unprocessable_entity
        else
          render json: updated_query, status: :ok
        end
      end
    end
  end

  def destroy
    respond_to do |format|
      format.json do
        @query.destroy!
        render json: @query
      end
    end
  end

  private

  def retrieve_query
    @query = Query.find(params[:id])
  end

  def query_pagination_params
    params.permit(:limit, :offset, :search, :sort_by, :sort_descending, :reset)
  end

  def set_query_version
    if params[:version_id] && params[:version_id] != 'latest'
      @query.version = QueryVersion.find(params[:version_id])
    end
  end

  def set_query_version_from_query
    if params[:query][:version] && params[:query][:version][:id]
      @query.version = QueryVersion.find(params[:query][:version][:id])
    end
  end
end
