class QuerySerializer < ActiveModel::Serializer
  def tags
    object.performant_tag_list
  end

  attributes :id, :title, :created_at, :updated_at, :tags, :roles
  has_one :version
end
