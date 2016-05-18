class QueryIndexSerializer < ActiveModel::Serializer
  def tags
    object.performant_tag_list
  end

  attributes :id, :title, :created_at, :updated_at, :tags, :latest_author_name, :roles, :latest_body, :summary
end
