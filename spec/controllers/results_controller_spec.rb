require 'spec_helper'

RSpec.describe ResultsController, type: :controller do
  include Devise::TestHelpers

  let(:admin_user) { create(:user, role: 'admin') }
  let(:basic_user) { create(:user, role: 'basic') }
  let(:admin_query) { create(:query, roles: %w(admin)) }
  let(:basic_query) { create(:query, roles: %w(basic admin)) }
  let(:basic_query_version) { create(:query_version, query: basic_query) }
  let(:admin_query_version) { create(:query_version, query: admin_query) }
  let(:basic_result) { create(:result, query_version: basic_query_version) }
  let(:admin_result) { create(:result, query_version: admin_query_version) }
  let(:orphan_result) { create(:result, query_version: nil, owner: basic_user) }
  let(:orphan_result_without_owner) { create(:result, query_version: nil) }

  before do
    stub_github_calls
    request.env['HTTP_ACCEPT'] = 'application/json'
    admin_result
    basic_result
  end

  def count_with_user_role(results, role)
    results.map { |result| result.query.roles }.count { |a| a.include?(role) }
  end

  describe 'GET index' do
    context 'with a basic user' do
      before { sign_in(basic_user) }

      it "assigns @results, including only results with queries that match the current user's roles" do
        get :index, query_id: basic_query.id, query_version_id: 'latest'
        expect(count_with_user_role(assigns(:results), basic_user.role)).to eq(assigns(:results).length)
        get :index, query_id: admin_query.id, query_version_id: 'latest'
        expect(count_with_user_role(assigns(:results), basic_user.role)).to eq(assigns(:results).length)
      end
    end

    context 'with an admin user' do
      before { sign_in(admin_user) }

      it 'does the same as above if the user has an admin role' do
        get :index, query_id: basic_query.id, query_version_id: 'latest'
        expect(count_with_user_role(assigns(:results), admin_user.role)).to eq(assigns(:results).length)
        get :index, query_id: admin_query.id, query_version_id: 'latest'
        expect(count_with_user_role(assigns(:results), admin_user.role)).to eq(assigns(:results).length)
      end
    end
  end

  describe 'GET show' do
    context 'with a basic user' do
      before { sign_in(basic_user) }

      it %(responds with unauthorized if the roles of the query associated with the result requested
        do not contain the current user's role) do
        get :show, id: admin_result.id
        assert_response :unauthorized
      end

      it %(responds with unauthorized if the result requested
        is not owned by the current user and the result has no query_version) do
        get :show, id: orphan_result_without_owner.id
        assert_response :unauthorized
      end

      it "assigns @result if the result has no query_version and the user is the result's owner" do
        get :show, id: orphan_result.id
        expect(assigns(:result)).to eq(orphan_result)
        assert_response :success
      end
    end

    context 'with an admin user' do
      before { sign_in(admin_user) }

      it %(assigns @result if the the roles of the query associated with the result requested
        do contain the current user's role) do
        get :show, id: admin_result.id
        expect(assigns(:result)).to eq(admin_result)
        assert_response :success
      end
    end
  end

  describe 'delete DESTROY' do
    context 'with a basic user' do
      before { sign_in(basic_user) }

      it %(responds with unauthorized if the roles of the query associated with the result requested
        do not contain the current user's role) do
        delete :destroy, id: admin_result.id
        assert_response :unauthorized
      end
    end

    context 'with an admin user' do
      before { sign_in(admin_user) }

      it %(deletes and redirects if roles of the query associated with the result requested
        do contain the current user's role) do
        delete :destroy, id: admin_result.id
        assert_response :success
      end
    end
  end
end
