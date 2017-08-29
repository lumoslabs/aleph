module Admin
  class BaseController < ApplicationController
    before_filter :verify_admin
    private
    def verify_admin
      Rails.logger.info("am i an admin??? #{current_user.try(:admin?)}")
      redirect_to root_url unless current_user.try(:admin?)
    end
  end
end
