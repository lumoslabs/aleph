require File.expand_path('../boot', __FILE__)

require 'rails/all'
require 'dotenv/rails-now'
require_relative '../lib/aleph_log_formatter'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Aleph
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]

    # Configure the default encoding used in templates for Ruby 1.9.
    config.encoding = "utf-8"

    # Configure sensitive parameters which will be filtered from the log file.
    config.filter_parameters += [:password]

    # Enable escaping HTML in JSON.
    config.active_support.escape_html_entities_in_json = true

    # Enable the asset pipeline
    config.assets.enabled = true

    # Version of your assets, change this if you want to expire all your assets
    config.assets.version = '1.0'

    # This will become the default in future versions of Rails.
    I18n.config.enforce_available_locales = true

    # Rack::Lock was causing issues in test
    config.middleware.delete Rack::Lock if Rails.env.test?

    config.autoload_paths += Dir["#{config.root}/lib/**/"]

    config.assets.initialize_on_precompile = false
    config.assets.precompile += %w(*.svg *.eot *.woff *.ttf)

    config.logger = Logger.new(STDOUT)
    config.log_formatter = ::AlephLogFormatter.new
  end

  Application.config.disable_sql_logging = false
end
