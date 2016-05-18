# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'capybara/rails'
require 'database_cleaner'
require 'rspec/rails'
require 'webmock/rspec'
require 'fakeredis'
require 'coveralls'

Coveralls.wear!
# Requires supporting ruby files with custom matchers and macros, etc,
# in spec/support/ and its subdirectories.
Dir[Rails.root.join('spec/support/**/*.rb')].each { |f| require f }

RSpec.configure do |config|
  config.include Rails.application.routes.url_helpers
  config.include Capybara::DSL
  Capybara.javascript_driver = :webkit

  config.mock_with :rspec
  config.alias_it_should_behave_like_to :it_has_behavior, 'has behavior:'

  config.use_transactional_fixtures = false

  config.before(:each, js: true) do
    page.driver.allow_url("https://fonts.googleapis.com/css?family=Lato:300italic,400italic,700italic,400,300,700")
    page.driver.allow_url("d37gvrvc0wt4s1.cloudfront.net")
  end

  database_cleaners = [
    DatabaseCleaner, # for the app test database
    DatabaseCleaner[:active_record, {connection: :test}], # for the test database
  ]

  database_cleaners.each do |database_cleaner|
    config.before :suite do
      database_cleaner.clean_with(:truncation) # in case you interrupt specs
    end

    config.before do
      database_cleaner.strategy = :truncation
      database_cleaner.start
    end

    config.after do
      database_cleaner.clean
    end
  end

  config.include FactoryGirl::Syntax::Methods

  config.infer_base_class_for_anonymous_controllers = true

  # Run specs in random order to surface order dependencies. If you find an
  # order dependency and want to debug it, you can fix the order by providing
  # the seed, which is printed after each run.
  #     --seed 1234
  config.order = 'random'

  WebMock.disable_net_connect!(:allow_localhost => true)
end

OmniAuth.config.test_mode = true
