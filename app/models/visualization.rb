class Visualization < ActiveRecord::Base
  belongs_to :query_version
  has_one :query, through: :query_version
  has_many :query_roles, through: :query

  scope :with_role, ->(role) { references(:query).includes(:query_roles).where(query_roles: { role: role }) }
end
