require 'spec_helper'

describe User do
  let(:user) { create(:user, role: 'basic') }
  let(:basic_query) { create(:query, roles: %w(basic admin)) }
  let(:admin_query) { create(:query, roles: %w(admin)) }
  let(:basic_query_version) { create(:query_version, query: basic_query) }
  let(:admin_query_version) { create(:query_version, query: admin_query) }
  let(:basic_alert) { create(:alert, query: basic_query) }
  let(:admin_alert) { create(:alert, query: admin_query) }
  let(:basic_result) { create(:result, query_version: basic_query_version) }
  let(:admin_result) { create(:result, query_version: admin_query_version) }
  let(:basic_visualization) { create(:visualization, query_version: basic_query_version) }
  let(:admin_visualization) { create(:visualization, query_version: admin_query_version) }
  let(:orphan_result) { create(:result, query_version: nil, owner: user) }
  let(:orphan_result_without_owner) { create(:result, query_version: nil) }

  before { stub_github_calls }

  describe 'abilities' do
    subject { Ability.new(user) }

    it 'allows users to access queries with roles containing their role' do
      expect(subject.can?(:read, basic_query)).to be_truthy
    end

    it 'does not allow users to access queries with roles not containing their roles' do
      expect(subject.can?(:read, admin_query)).to be_falsey
    end

    it %(allows users to access Results, QueryVersions, Visualiztions, Alerts
      associated with queries with roles containing their role) do
      expect(subject.can?(:read, basic_query_version)).to be_truthy
      expect(subject.can?(:read, basic_result)).to be_truthy
      expect(subject.can?(:read, basic_visualization)).to be_truthy
      expect(subject.can?(:read, basic_alert)).to be_truthy
    end

    it %(does not allow users to access Results, QueryVersions, Visualiztions, Alerts
      associated with queries with roles not containing their role) do
      expect(subject.can?(:read, admin_query_version)).to be_falsey
      expect(subject.can?(:read, admin_result)).to be_falsey
      expect(subject.can?(:read, admin_visualization)).to be_falsey
      expect(subject.can?(:read, admin_alert)).to be_falsey
    end

    it "allows a user to access a Result if it has no query version and they are the Result's owner" do
      expect(subject.can?(:read, orphan_result)).to be_truthy
    end

    it "does not allows a user to access a Result if it has no query version and they are not the Result's owner" do
      expect(subject.can?(:read, orphan_result_without_owner)).to be_falsey
    end
  end
end
