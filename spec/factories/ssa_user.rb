FactoryGirl.define do
  factory :ssa_user do
    provider 'google_oauth2'
    uid '100343701462486002380'
    name 'Matt Spatola'
    email_address 'yospliff@yospliff.com'
    email_verified true
    groups ['reports']
    role 'admin'
  end
end
