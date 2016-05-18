require 'spec_helper'

RSpec.describe QueryVersionsController, type: :controller do
  include Devise::TestHelpers

  let(:admin_user) { create(:user, role: 'admin') }
  let(:basic_user) { create(:user, role: 'basic') }
  let(:admin_query) { create(:query, roles: %w(admin)) }
  let(:basic_query) { create(:query, roles: %w(basic admin)) }
  let(:basic_query_version) { create(:query_version, query: basic_query) }
  let(:admin_query_version) { create(:query_version, query: admin_query) }

  before do
    stub_github_calls
    request.env['HTTP_ACCEPT'] = 'application/json'
    admin_query_version
    basic_query_version
  end

  def count_with_user_role(query_versions, role)
    query_versions.map { |query_version| query_version.query.roles }.count {|a| a.include?(role) }
  end

  describe 'GET index' do
    context 'with a basic user' do
      before { sign_in(basic_user) }

      it "assigns @query_versions, including only query_versions with queries that match the current user's roles" do
        get :index, { query_id: basic_query.id }, user_id: basic_user.id
        expect(count_with_user_role(assigns(:query_versions), basic_user.role)).to eq(assigns(:query_versions).length)
        get :index, { query_id: admin_query.id }, user_id: basic_user.id
        expect(count_with_user_role(assigns(:query_versions), basic_user.role)).to eq(assigns(:query_versions).length)
      end
    end

    context 'with an admin user' do
      before { sign_in(admin_user) }

      it 'does the same as above if the user has an admin role' do
        get :index, { query_id: basic_query.id }, user_id: admin_user.id
        expect(count_with_user_role(assigns(:query_versions), admin_user.role)).to eq(assigns(:query_versions).length)
        get :index, { query_id: admin_query.id }, user_id: admin_user.id
        expect(count_with_user_role(assigns(:query_versions), admin_user.role)).to eq(assigns(:query_versions).length)
      end
    end
  end

  describe 'GET show' do
    context 'with a basic user' do
      before { sign_in(basic_user) }

      it %(responds with unauthorized if the roles of the query associated with the query_version requested
        do not contain the current user's role) do
        get :show, id: admin_query_version.id
        assert_response :unauthorized
      end
    end

    context 'with a basic user' do
      before { sign_in(admin_user) }

      it %(assigns @query_version if the the roles of the query associated with the query_version requested
        do contain the current user's role) do
        get :show, id: admin_query_version.id
        expect(assigns(:query_version)).to eq(admin_query_version)
        assert_response :success
      end
    end
  end
end
