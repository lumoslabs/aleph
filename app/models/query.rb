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
  after_save :create_roles

  delegate :version, :author_name, :results, to: :latest_query_version, prefix: :latest, allow_nil: true
  delegate :id, to: :latest_query_version, prefix: true, allow_nil: true
  delegate :to_csv, to: :latest_completed_result, allow_nil: true
  delegate :user, to: :latest_query_version

  scope :with_role, ->(role) { includes(:query_roles).where(query_roles: { role: role }) }
  scope :scheduled, -> { where(scheduled_flag: true) }

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

  def self.run_scheduled
    scheduled.each do |query|
      Resque.enqueue(ScheduledQueryExecution, query.id, query.user.role)
    end
  end

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

  def send_result_email
    QueryMailer.query_result_email(self).deliver_now!
  end

  def latest_query_version
    query_versions.last
  end

  def latest_result_key
    @latest_result_key ||= "latest_#{AwsS3::S3_FOLDER}/query_#{id}.csv"
  end

  def latest_result_object_url
    @latest_result_object_url ||= "https://s3.amazonaws.com/#{AwsS3::S3_BUCKET}/#{latest_result_key}"
  end

  def roles
    query_roles.map(&:role).uniq
  end

  def set_roles(roles)
    @roles_to_create = roles
  end

  def create_roles
    return unless @roles_to_create.present?
    query_roles.delete_all
    @roles_to_create.each { |role| query_roles.create(role: role) }
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
      { versions: 1, comments: qv.comment.blank? ? 0 : 1 }
    end
  end

  private

  def strip_carriage_returns
    [:title, :latest_body].each do |attribute|
      self[attribute].gsub!("\r\n", "\n")
    end
  end
end
