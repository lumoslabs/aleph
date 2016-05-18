require 'spec_helper'

RSpec.describe VisualizationsController, type: :controller do
  include Devise::TestHelpers

  let(:admin_user) { create(:user, role: 'admin') }
  let(:basic_user) { create(:user, role: 'basic') }
  let(:admin_query) { create(:query, roles: %w(admin)) }
  let(:basic_query) { create(:query, roles: %w(basic admin)) }
  let(:basic_query_version) { create(:query_version, query: basic_query) }
  let(:admin_query_version) { create(:query_version, query: admin_query) }
  let(:basic_visualization) { create(:visualization, query_version: basic_query_version) }
  let(:admin_visualization) { create(:visualization, query_version: admin_query_version) }

  before do
    stub_github_calls
    request.env['HTTP_ACCEPT'] = 'application/json'
    admin_visualization
    basic_visualization
    allow_any_instance_of(Visualization).to receive(:update) { true }
    allow_any_instance_of(Visualization).to receive(:errors) { [] }
  end

  def count_with_user_role(visualizations, role)
    visualizations.map { |visualization| visualization.query.roles }.count { |a| a.include?(role) }
  end

  describe 'GET index' do
    context 'with a basic user' do
      before { sign_in(basic_user) }

      it "assigns @visualizations, including only visualizations with queries that match the current user's roles" do
        get :index, { query_id: basic_query.id, query_version_id: basic_query_version.id }, user_id: basic_user.id
        expect(count_with_user_role(assigns(:visualizations), basic_user.role)).to eq(assigns(:visualizations).length)
        get :index, { query_id: admin_query.id, query_version_id: admin_query_version.id }, user_id: basic_user.id
        expect(count_with_user_role(assigns(:visualizations), basic_user.role)).to eq(assigns(:visualizations).length)
      end
    end

    context 'with an admin user' do
      before { sign_in(admin_user) }

      it 'does the same as above if the user has an admin role' do
        get :index, { query_id: basic_query.id, query_version_id: basic_query_version.id }, user_id: admin_user.id
        expect(count_with_user_role(assigns(:visualizations), admin_user.role)).to eq(assigns(:visualizations).length)
        get :index, { query_id: admin_query.id, query_version_id: admin_query_version.id }, user_id: admin_user.id
        expect(count_with_user_role(assigns(:visualizations), admin_user.role)).to eq(assigns(:visualizations).length)
      end
    end
  end

  describe 'POST update' do
    context 'with a basic user' do
      before { sign_in(basic_user) }

      it %(responds with unauthorized if the roles of the query associated with the visualization requested
        do not contain the current user's role) do
        post :update, { id: admin_visualization.id }, user_id: basic_user.id
        assert_response :unauthorized
      end
    end

    context 'with an admin user' do
      before { sign_in(admin_user) }

      it %(assigns @visualization if the the roles of the query associated with the visualization requested
        do contain the current user's role) do
        post :update, { id: admin_visualization.id }, user_id: admin_user.id
        expect(assigns(:visualization)).to eq(admin_visualization)
        assert_response :success
      end
    end
  end

  describe 'delete DESTROY' do
    context 'with a basic user' do
      before { sign_in(basic_user) }

      it %(responds with unauthorized if the roles of the query associated with the visualization requested
        do not contain the current user's role) do
        delete :destroy, { id: admin_visualization.id }, user_id: basic_user.id
        assert_response :unauthorized
      end
    end

    context 'with an admin user' do
      before { sign_in(admin_user) }

      it %(deletes and redirects if roles of the query associated with the visualization requested
        do contain the current user's role) do
        delete :destroy, { id: admin_visualization.id }, user_id: admin_user.id
        assert_response :success
      end
    end
  end
end
