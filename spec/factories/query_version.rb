FactoryGirl.define do
  factory :query_version do
    version 1
    parameters []
    query

    initialize_with { new(attributes.stringify_keys) }

    after(:build) do |qv|
      qv.blob_sha = '123456789abcdef123456789abcdef123456789a'
      qv.user = build(:user)
    end

    factory :no_version_query_version do
      version nil
    end

    factory :no_query_query_version do
      query nil
    end
  end
end
