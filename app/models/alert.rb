require 'ostruct'

class Alert < ActiveRecord::Base
  extend PaginationSearch::Pagination

  has_paper_trail
  attr_accessor :query_title
  cattr_accessor :cache
  belongs_to :query
  has_many :query_roles, through: :query
  belongs_to :last_alert_result, class_name: 'Result'
  has_many :query_versions, through: :query
  has_many :users, through: :query
  validates :email, :query, :target, :comparator, :query, presence: true
  before_create :set_pending_status
  before_save :update_query_title

  delegate :latest_query_version, to: :query
  delegate :user, to: :latest_query_version

  scope :with_role, ->(role) { references(:query).includes(:query_roles).where(query_roles: { role: role }) }

  LOCATIONS_FOR_ATTRIBUTES = {
    title:       { association: :query, column: :title, type: :text },
    status:      { association: :base, column: :status, type: :text },
    description: { association: :base, column: :description, type: :text },
    author:      { association: :users, column: :name, type: :text },
    updated_at:  { association: :base, column: :updated_at, type: :time },
    created_at:  { association: :base, column: :created_at, type: :time }
  }.freeze

  INCLUDES_MODELS = [:query_versions, :query, :last_alert_result, :users].freeze

  paginate_with LOCATIONS_FOR_ATTRIBUTES

  STATUSES = OpenStruct.new(
    {
      pending: 'Pending',
      errored: 'Errored',
      passing: 'Passing',
      failing: 'Failing',
      paused:  'Paused'
    }
  )

  COMPARISON_FUNCTIONS = {
    '<' => :result_is_less_than_target,
    '>' => :result_is_greater_than_target,
    '=' => :result_is_equal_to_target
  }

  BAD_DATA_SIZE_MESSAGE = 'An alert result must return only a single row and a single column'
  BAD_DATA_TYPE_MESSAGE = 'An alert must return a number'

  def self.run_all
    all.each(&:run)
  end

  def run
    unless status == STATUSES.paused
      Resque.enqueue(AlertExecution, id, user.role)
    end
  end

  def error(message)
    self.status = STATUSES.errored
    self.error_message = message
    save!
    send_failing_email
  end

  def check_last_result
    last_alert_result.reload
    return if error_from_result_failure
    data = last_alert_result.sample_data
    return if error_from_data_size(data)
    return unless value = to_number(data.first.first)
    set_status_from_outcome(value)
  end

  def query_title
    @query_title ||= query.title
  end

  private

  def update_query_title
    return query.update_attribute(:title, @query_title) if @query_title && !@query_title.empty?
    true
  end

  def set_status_from_outcome(outcome_value)
    failing = send(COMPARISON_FUNCTIONS.fetch(comparator), outcome_value)
    if failing
      self.status = STATUSES.failing
      send_failing_email
    else
      self.status = STATUSES.passing
    end
    save!
  end

  def send_failing_email
    AlertMailer.alert_failing_email(self).deliver_now!
  rescue
    # note: this code is typically called in a resque_worker, so you may not see the below
    Rails.logger.warn("Could not send alert failing email, please check your alerts configuration's smtp settings")
  end

  def result_is_less_than_target(result)
    result < target
  end

  def result_is_greater_than_target(result)
    result > target
  end

  def result_is_equal_to_target(result)
    result == target
  end

  def set_pending_status
    self.status = STATUSES.pending
  end

  def error_from_result_failure
    error(last_alert_result.error_message) if last_alert_result.status == 'failed'
  end

  def error_from_data_size(data)
    error(BAD_DATA_SIZE_MESSAGE) if data.length != 1 || data.first.length != 1
  end

  def to_number(string)
    float = Float(string) rescue false
    error(BAD_DATA_TYPE_MESSAGE) unless float
    float
  end
end
