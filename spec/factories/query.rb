FactoryGirl.define do
  factory :query do
    title 'AAAA Get the current date and time'
    latest_body 'SELECT TIMEOFDAY();'
    scheduled_flag false
    transient { roles [] }

    after(:build) do |query, evaluator|
      query.query_versions.build(attributes_for(:query_version).merge({query: query}).stringify_keys)
      query.query_versions.first.blob_sha = '123456789abcdef123456789abcdef123456789a'
      query.query_versions.first.user = build(:user)
      query.set_roles(evaluator.roles) if evaluator.roles.present?
    end

    factory :multi_line_query do
      title 'BBBB Count registered users, split by original_language'
      latest_body [
        'SELECT original_language, COUNT(1) user_count',
        'FROM warehouse.user_dimension',
        'GROUP BY original_language',
        'ORDER BY user_count DESC;'
      ].join(" ")
      after(:build) do |query|
        query.query_versions.build(attributes_for(:multi_line_query_version).merge({query: multi_line_query}).stringify_keys)
      end
    end

    factory :query_returning_many_rows do
      title 'Select all the users!'
      tag_list ['lifecycle', 'analytics']
      latest_body 'SELECT * FROM warehouse.user_dimension;'
      after(:build) do |query|
        query.query_versions.build(attributes_for(:query_version_returning_many_rows).merge({query: query_returning_many_rows}).stringify_keys)
      end
    end

    factory :syntax_error_query do
      title 'This should raise a PG::SyntaxError exception!'
      tag_list ['lifecycle', 'analytics']
      latest_body 'asdf'
      after(:build) do |query|
        query.query_versions.build(attributes_for(:syntax_error_query_version).merge({query: syntax_error_query}).stringify_keys)
      end
    end

    factory :undefined_table_query do
      title 'This should raise a PG::UndefinedTable exception!'
      tag_list ['lifecycle', 'analytics']
      latest_body 'SELECT * FROM jkl;'
      after(:build) do |query|
        query.query_versions.build(attributes_for(:undefined_table_query_version).merge({query: undefined_table_query}).stringify_keys)
      end
    end

    factory :no_title_query do
      title ''
    end

    factory :carriage_return_title_query do
      title "\n\r\n"
    end

    factory :carriage_return_body_query do
      latest_body "\n\r\n"
    end

    factory :no_latest_body_query do
      latest_body ''
    end
  end
end
