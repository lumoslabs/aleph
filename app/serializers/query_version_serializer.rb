class QueryVersionSerializer < ActiveModel::Serializer
  attributes :id, :body, :created_at, :updated_at, :parameters, :author_name, :query_id, :version, :comment, :commit_sha, :summary
end
