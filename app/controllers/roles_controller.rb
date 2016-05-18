class RolesController < ApplicationController
  respond_to :json

  def index
    respond_to do |format|
      format.json { render json: User.distinct.pluck(:role) }
    end
  end
end
