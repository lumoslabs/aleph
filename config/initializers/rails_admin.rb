RailsAdmin.config do |config|
  config.authenticate_with do
    redirect_to main_app.root_path unless current_user.try(:admin?)
  end

  config.included_models = ['User']

  config.model 'User' do
    exclude_fields :remember_created_at
    if Authentication.type.saml?
      exclude_fields :password
      exclude_fields :password_confirmation
    end
  end

  config.actions do
    dashboard
    index
    new
    export
    bulk_delete
    show
    edit
    delete
    show_in_app
  end
end
