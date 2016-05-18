class AlertSerializer < ActiveModel::Serializer
  def author_name
    object.user.name
  end

  attributes :id, :query_title, :status, :author_name, :description, :email, :comparator, :target, :query_id

  has_one :last_alert_result
  has_one :latest_query_version
end
