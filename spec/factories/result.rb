FactoryGirl.define do
  factory :result do
    status 'complete'
    sample_data [['1']]
    headers ['?column?']
    parameters {}
    compiled_body 'SELECT 1'
    query_version
  end
end
