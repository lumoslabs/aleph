class ResultCsvsController < ApplicationController
  respond_to :json
  before_filter :authorize_from_result, only: [:show]
  before_filter :log_download, only: [:show]

  def show
    respond_to do |format|
      format.json do
        url = CsvService.new(params[:id]).url
        if url
          render json: { url: url }
        else
          render nothing: true, status: 404
        end
      end
    end
  end

  private

  def authorize_from_result
    authorize! :read, Result.find(params[:id])
  end

  def log_download
    Rails.logger.info("Result CSV download requested for result #{params[:id]} by user_id #{current_user.id}")
  end

end
