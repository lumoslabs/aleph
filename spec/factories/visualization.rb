FactoryGirl.define do
  factory :visualization do
    title 'Test viz'
    html_source '<html></html>'
    query_version
  end
end
