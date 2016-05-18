FactoryGirl.define do
  factory :alert do
    email 'rob@rob.com'
    comparator '>'
    target 10
    query

    factory :previously_run_alert do
      association :last_alert_result, factory: :result
    end
  end
end
