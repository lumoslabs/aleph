class Query < ActiveRecord::Base
  extend PaginationSearch::Pagination

  has_paper_trail
  acts_as_taggable
  acts_as_paranoid
  cattr_accessor :cache
  attr_writer :version
  has_many :query_versions, dependent: :destroy, inverse_of: :query
  has_many :results, through: :query_versions
  has_many :users, through: :query_versions
  has_many :query_roles, dependent: :delete_all
  accepts_nested_attributes_for :query_versions

  validates_presence_of :title, :latest_body, :query_versions
  validates_associated :query_versions
  before_save :strip_carriage_returns

  delegate :version, :author_name, :results, to: :latest_query_version, prefix: :latest, allow_nil: true
  delegate :id, to: :latest_query_version, prefix: true, allow_nil: true
  delegate :to_csv, to: :latest_completed_result, allow_nil: true

  scope :with_role, ->(role) { includes(:query_roles).where(query_roles: { role: role }) }

  LOCATIONS_FOR_ATTRIBUTES = {
    title:       { association: :base, column: :title, type: :text },
    body:        { association: :base, column: :latest_body, type: :text },
    author:      { association: :users, column: :name, type: :text },
    tags:        { association: :tags, column: :name, type: :text },
    updated_at:  { association: :base, column: :updated_at, type: :time },
    created_at:  { association: :base, column: :created_at, type: :time }
  }.freeze

  INCLUDES_MODELS = [:query_versions, :users, :tags, :taggings].freeze

  paginate_with LOCATIONS_FOR_ATTRIBUTES

  def latest_completed_result
    latest_results.completed.last
  end

  def performant_tag_list
    # ActsAsTaggableOn's tag_list method triggers two queries for every record
    taggings.map do |tagging|
      tag = tags.find { |t| t.id == tagging.tag_id }
      tag.name if tag
    end
  end

  def latest_query_version
    query_versions.last
  end

  def roles
    query_roles.map(&:role).uniq
  end

  def set_roles(roles)
    query_roles.delete_all
    roles.each { |role| query_roles.build(role: role) }
  end

  def version
    @version || latest_query_version
  end

  def add_result(result)
    return unless result
    latest_query_version.add_result(result)
  end

  def summary
    Summarizer.new(query_versions).reduce(version: 0, comments: 0) do |qv|
      { versions: 1, comments: qv.comment.blank? ? 0 : 1}
    end
  end

  private

  def strip_carriage_returns
    [:title, :latest_body].each do |attribute|
      self[attribute].gsub!("\r\n", "\n")
    end
  end
end
