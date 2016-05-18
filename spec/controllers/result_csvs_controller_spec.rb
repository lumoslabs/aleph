require 'spec_helper'

RSpec.describe ResultCsvsController, type: :controller do
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
    allow_any_instance_of(CsvService).to receive(:download_url) { '' }
  end

  describe 'GET show' do
    context 'with a basic user' do
      before { sign_in(basic_user) }

      it %(responds with unauthorized if the roles of the query associated with the result_csv requested
        do not contain the current user's role) do
        get :show, id: admin_result.id
        assert_response :unauthorized
      end

      it %(responds with unauthorized if the result requested
        is not owned by the current user and the result has no query_version) do
        get :show, id: orphan_result_without_owner.id
        assert_response :unauthorized
      end

      it "responds successfully if the result has no query_version and the user is the result's owner" do
        get :show, id: orphan_result.id
        assert_response :success
      end
    end

    context 'with an admin user' do
      before { sign_in(admin_user) }

      it %(responds successfully if the the roles of the query associated with the result_csv requested
        do contain the current user's role) do
        get :show, id: admin_result.id
        assert_response :success
      end
    end
  end
end
