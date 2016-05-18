require 'spec_helper'

RSpec.describe AlertsController, type: :controller do
  include Devise::TestHelpers

  let(:admin_user) { create(:user, role: 'admin') }
  let(:basic_user) { create(:user, role: 'basic') }
  let(:admin_query) { create(:query, roles: %w(admin)) }
  let(:basic_query) { create(:query, roles: %w(basic admin)) }
  let(:basic_alert) { create(:alert, query: basic_query) }
  let(:admin_alert) { create(:alert, query: admin_query) }

  before do
    stub_github_calls
    request.env['HTTP_ACCEPT'] = 'application/json'
    admin_alert
    basic_alert
    allow_any_instance_of(Alert).to receive(:update_attributes!) { true }
    allow_any_instance_of(Alert).to receive(:run) { true }
  end

  def count_with_user_role(alerts, role)
    alerts.map { |alert| alert.query.roles }.count { |a| a.include?(role) }
  end

  describe 'GET index' do
    context 'with a basic user' do
      before { sign_in(basic_user) }

      it "assigns @paginated_alerts, including only alerts with queries that match the current user's roles" do
        get :index, limit: 10
        expect(count_with_user_role(assigns(:paginated_alerts), basic_user.role)).
          to eq(assigns(:paginated_alerts).count)
      end
    end

    context 'with an admin user' do
      before { sign_in(admin_user) }

      it 'does the same as above if the user has an admin role' do
        get :index, limit: 10
        expect(count_with_user_role(assigns(:paginated_alerts), admin_user.role)).
          to eq(assigns(:paginated_alerts).count)
      end
    end
  end

  describe 'GET show' do
    context 'with a basic user' do
      before { sign_in(basic_user) }

      it %(responds with unauthorized if the roles of the query associated with the alert requested
        do not contain the current user's role) do
        get :show, id: admin_alert.id
        assert_response :unauthorized
      end
    end

    context 'with an admin user' do
      before { sign_in(admin_user) }

      it %(assigns @alert if the the roles of the query associated with the alert requested
        do contain the current user's role) do
        get :show, { id: admin_alert.id }, user_id: admin_user.id
        expect(assigns(:alert)).to eq(admin_alert)
        assert_response :success
      end
    end
  end

  describe 'POST update' do
    context 'with a basic user' do
      before { sign_in(basic_user) }

      it %(responds with unauthorized if the roles of the query associated with the alert requested
        do not contain the current user's role) do
        post :update, id: admin_alert.id
        assert_response :unauthorized
      end
    end

    context 'with an admin user' do
      before { sign_in(admin_user) }

      it %(responds with success if the the roles of the query associated with the alert requested
        do contain the current user's role) do
        post :update, id: admin_alert.id, alert: { email: {} }
        assert_response :success
      end
    end
  end

  describe 'delete DESTROY' do
    context 'with a basic user' do
      before { sign_in(basic_user) }

      it %(responds with unauthorized if the roles of the query associated with the alert requested
        do not contain the current user's role) do
        delete :destroy, id: admin_alert.id
        assert_response :unauthorized
      end
    end

    context 'with an admin user' do
      before { sign_in(admin_user) }

      it %(deletes and redirects if roles of the query associated with the alert requested
        do contain the current user's role) do
        delete :destroy, { id: admin_alert.id }, user_id: admin_user.id
        assert_response :success
      end
    end
  end
end
