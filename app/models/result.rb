class Result < ActiveRecord::Base
  acts_as_paranoid
  belongs_to :query_version
  has_one :query, through: :query_version
  has_many :query_roles, through: :query
  belongs_to :owner, class_name: 'User'

  serialize :sample_data, JSON
  serialize :parameters, JSON
  serialize :headers, JSON

  scope :completed, -> { where(status: 'complete') }
  scope :with_role, ->(role) { joins(:query).includes(:query_roles).where(query_roles: { role: role }) }

  delegate :ongoing_row_count, to: :redis_result_row_count

  def mark_running!
    update_attributes!(status: 'running', started_at: Time.now)
  end

  def mark_processing_from_sample(result_sample)
    update_attributes!(status: 'processing', sample_data: result_sample)
  end

  def mark_complete_with_count(row_count)
    update_attributes!(status: 'complete', row_count: row_count, completed_at: Time.now)
  end

  def mark_failed!(message)
    update_attributes!(status: 'failed', error_message: message, completed_at: Time.now)
  end

  def row_count
    super || ongoing_row_count
  end

  def result_csv
    @result_csv ||= ResultCsv.new(id)
  end

  def redis_result_row_count
    @redis_result_row_count ||= RedisResultRowCount.new(self)
  end

  def run_duration
    duration(:started_at, :completed_at)
  end

  def enqueue_duration
    duration(:created_at, :started_at)
  end

  private

  def duration(start_field, end_field)
    start_ts = public_send(start_field)
    end_ts = public_send(end_field)

    if start_ts && end_ts
      end_ts - start_ts
    elsif start_ts
      Time.zone.now - start_ts
    else
      0
    end
  end
end
