class User < ActiveRecord::Base
  if Authentication.type.saml?
    devise :saml_authenticatable, :rememberable
  else
    # both database and disabled authentication styles use devise 'database_authentication'
    # disabled actually just signs in a guest user for every request from application_controller
    devise :database_authenticatable, :rememberable
  end

  has_many :query_versions
  has_many :queries, through: :query_versions
  has_many :snippets

  serialize :groups

  def self.guest_user
    where(email: 'guest-user@test.com', role: Role::ADMIN_ROLE, name: 'Guest').first_or_create
  end

  def admin?
    role == Role::ADMIN_ROLE
  end
end
