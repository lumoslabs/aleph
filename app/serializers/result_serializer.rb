class ResultSerializer < ActiveModel::Serializer
  attributes :id, :created_at, :started_at, :updated_at, :status, :error_message, :headers, :parameters, :query_version_id, :row_count, :started_at, :completed_at, :sample_data, :enqueue_duration, :run_duration
end
