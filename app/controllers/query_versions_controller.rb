class QueryVersionsController < ApplicationController
  respond_to :html, :json

  before_filter :retrieve_query_version, only: :show
  authorize_resource only: [:show]

  def index
    respond_to do |format|
      format.json do
        @query_versions = query_versions.accessible_by(current_ability)
        render json: @query_versions
      end
    end
  end

  def show
    respond_to do |format|
      format.html { render :index }
      format.json do
        render json: @query_version
      end
    end
  end

  private

  def retrieve_query_version
    @query_version ||= if params[:id] == 'latest'
      query_versions.first
    else
      QueryVersion.find(params[:id])
    end
  end

  def query_versions
    QueryVersion.where(query_id: params[:query_id]).order('version DESC')
  end
end
