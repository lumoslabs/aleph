require 'spec_helper'

RSpec.describe QueriesController, type: :controller do
  include Devise::TestHelpers

  let(:admin_user) { create(:user, role: 'admin') }
  let(:basic_user) { create(:user, role: 'basic') }
  let(:admin_query) { create(:query, roles: %w(admin)) }
  let(:basic_query) { create(:query, roles: %w(basic admin)) }

  before do
    stub_github_calls
    request.env['HTTP_ACCEPT'] = 'application/json'
    admin_query
    basic_query
    update_double = instance_double('Interaction::QueryUpdate', execute: admin_query, errors: [])
    allow(Interaction::QueryUpdate).to receive(:new) { update_double }
  end

  describe 'GET index' do
    context 'with a basic user' do
      before { sign_in(basic_user) }

      it "assigns @paginated_queries, including only queries that match the current user's roles" do
        get :index, limit: 10
        count_with_user_role = assigns(:paginated_queries).map(&:roles).count { |a| a.include?(basic_user.role) }
        expect(count_with_user_role).
          to eq(assigns(:paginated_queries).length)
      end
    end

    context 'with an admin user' do
      before { sign_in(admin_user) }

      it 'does the same as above if the user has an admin role' do
        get :index, limit: 10
        count_with_user_role = assigns(:paginated_queries).map(&:roles).count { |a| a.include?(admin_user.role) }
        expect(count_with_user_role).to eq(assigns(:paginated_queries).length)
      end
    end
  end

  describe 'GET show' do
    context 'with a basic user' do
      before { sign_in(basic_user) }

      it "responds with unauthorized if the roles of query requested do not contain the current user's role" do
        get :show, id: admin_query.id
        assert_response :unauthorized
      end
    end

    context 'with an admin user' do
      before { sign_in(admin_user) }

      it "assigns @query if the the roles of query requested do contain the current user's role" do
        get :show, id: admin_query.id
        expect(assigns(:query)).to eq(admin_query)
        assert_response :success
      end
    end
  end

  describe 'POST update' do
    context 'with a basic user' do
      before { sign_in(basic_user) }

      it "responds with unauthorized if the roles of query requested do not contain the current user's role" do
        post :update, id: admin_query.id
        assert_response :unauthorized
      end
    end

    context 'with an admin user' do
      before { sign_in(admin_user) }

      it "responds with success if the the roles of query requested do contain the current user's role" do
        post :update, id: admin_query.id, query: {}
        assert_response :success
      end
    end
  end

  describe 'delete DESTROY' do
    context 'with a basic user' do
      before { sign_in(basic_user) }

      it "responds with unauthorized if the roles of query requested do not contain the current user's role" do
        delete :destroy, id: admin_query.id
        assert_response :unauthorized
      end
    end

    context 'with an admin user' do
      before { sign_in(admin_user) }

      it "deletes and redirects if roles of query requested do contain the current user's role" do
        delete :destroy, id: admin_query.id
        assert_response :success
      end
    end
  end
end
