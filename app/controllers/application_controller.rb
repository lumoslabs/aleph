class ApplicationController < ActionController::Base
  ALLOWABLE_CONFIGS = %w(github_ref github_owner github_app_name github_repo)

  if Authentication.type.disabled?
    before_action :set_guest_user
  else
    before_action :authenticate_user!
  end
  before_filter :set_hostname
  before_filter :set_cache_buster
  helper_method :app_config

  rescue_from CanCan::AccessDenied do
    #redirect_to unauthorized_path
    render :unauthorized, layout: false, status: :unauthorized
  end

  private

  def app_config
    APP_CONFIG.select { |k, _| ALLOWABLE_CONFIGS.include?(k) }.to_json
  end

  def set_hostname
    @hostname = request.host
  end

  def set_cache_buster
    response.headers["Cache-Control"] = "no-cache, no-store, max-age=0, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "#{1.year.ago}"
  end

  def set_guest_user
    logger.warn('AUTHENTICATION DISABLED: SIGNING IN GUEST USER') if Rails.env.production?
    sign_in(User.guest_user)
  end
end
