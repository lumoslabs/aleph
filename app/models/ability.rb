class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new

    can :manage, Query, Query.with_role(user.role) do |query|
      query.roles.include?(user.role)
    end

    can :manage, Alert, Alert.with_role(user.role) do |alert|
      alert.query.roles.include?(user.role)
    end

    can :manage, QueryVersion, QueryVersion.with_role(user.role) do |query_version|
      query_version.query.roles.include?(user.role)
    end

    can :manage, Result, Result.with_role(user.role) do |result|
      if result.query
        result.query.roles.include?(user.role)
      else
        user == result.owner
      end
    end

    can :manage, Visualization, Visualization.with_role(user.role) do |visualization|
      visualization.query.roles.include?(user.role)
    end
  end
end
