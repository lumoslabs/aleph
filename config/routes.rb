require 'resque_web'

Rails.application.routes.draw do
  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  devise_for :users

  resources :queries do
    resources :query_versions, only: [:index, :show] do
      resources :results, only: [:index, :show, :create, :destroy]
      resources :visualizations, only: [:index, :create, :update, :destroy]
    end
    resources :results, only: :create
  end

  resources :columns, only: [:index]
  resources :roles, only: [:index]
  resources :tags, only: [:index, :create, :destroy]
  resources :alerts, only: [:show, :index, :create, :update, :destroy]
  resources :snippets, only: [:show, :index, :create, :update, :destroy]

  resources :query_versions, only: :show
  resources :results, only: [:show, :create, :destroy]
  resources :visualizations, only: [:create, :update, :destroy]
  resources :schema_comments, only: [:create, :update, :destroy]
  resources :result_csvs, only: :show

  scope module: 'admin' do
    resources :running_results, only: [:index]
  end

  mount ResqueWeb::Engine => "/resque_web"

  root :to => 'application#index'

  # first step in any request is that we need to serve the angular app
  get '*path' => 'application#index'
  ResqueWeb::Engine.eager_load!
end
