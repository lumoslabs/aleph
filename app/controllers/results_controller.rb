class ResultsController < ApplicationController
  include QueryVersionSupport

  respond_to :json, :html
  load_and_authorize_resource only: [:show, :destroy]
  before_filter :retrieve_query_version, if: -> { params[:query_id] }, only: [:index]

  def index
    respond_to do |format|
      format.html
      format.json do
        @results = @query_version.results.accessible_by(current_ability)
        render json: @results
      end
    end
  end

  def show
    respond_to do |format|
      format.html { render :index }
      format.json { render json: @result }
    end
  end

  def destroy
    respond_to do |format|
      format.json do
        @result.destroy!
        render json: @result
      end
    end
  end

  def create
    interaction = Interaction::ResultCreation.new(result_params)
    result = interaction.execute

    if interaction.errors.any?
      render json: interaction.errors, status: :unprocessable_entity
    else
      Resque.enqueue(QueryExecution, result.id, current_user.role)
      render json: result, status: :created
    end
  end

  private

  def result_params
    params.permit(:body, :query_version_id, :query_id).tap do |whitelisted|
      whitelisted[:substitution_values] = params[:substitution_values]
      whitelisted[:parameters] = params[:parameters]
    end.merge(owner: current_user)
  end
end
