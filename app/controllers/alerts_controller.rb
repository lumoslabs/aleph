class AlertsController < ApplicationController
  respond_to :json

  load_and_authorize_resource only: [:index, :show, :update, :destroy]
  wrap_parameters :alert, include: [:email, :query, :target, :comparator, :status, :description, :query_title, :query_id]

  def index
    respond_to do |format|
      format.html
      format.json do
        @paginated_alerts = Alert.paginated(@alerts, alert_pagination_params)
        render json: @paginated_alerts
      end
    end
  end

  def create
    respond_to do |format|
      format.json do
        alert = Alert.create(alert_params)

        if alert.errors.any?
          render json: alert.errors.full_messages, status: :unprocessable_entity
        else
          alert.run
          render json: alert, status: :created
        end
      end
    end
  end

  def update
    respond_to do |format|
      format.json do
        @alert.update_attributes!(alert_params)

        if @alert.errors.any?
          render json: @alert.errors.full_messages, status: :unprocessable_entity
        else
          @alert.run
          render json: @alert, status: :created
        end
      end
    end
  end

  def show
    respond_to do |format|
      format.json { render json: @alert }
      format.html { render template: 'application/index' }
    end
  end

  def destroy
    respond_to do |format|
      format.json do
        @alert.destroy!
        render json: @alert
      end
    end
  end

  private

  def alert_params
    params.require(:alert).permit(:email, :query_id, :target, :comparator, :status, :description, :query_title)
  end

  def alert_pagination_params
    params.permit(:limit, :offset, :search, :sort_by, :sort_descending, :reset)
  end
end
