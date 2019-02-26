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
  scope :with_role, ->(role) { references(:query).includes(:query_roles).where(query_roles: { role: role }) }

  delegate :ongoing_row_count, to: :redis_result_row_count

  def mark_running!
    update_attributes!(status: 'running', started_at: Time.now)
  end

  def mark_processing_from_sample(result_sample)
    update_attributes!(status: 'processing', sample_data: result_sample)
  end

  def mark_complete_with_count(row_count)
    update_attributes!(status: 'complete', row_count: row_count, completed_at: Time.now)
    copy_latest_result
  end

  def mark_failed!(message)
    update_attributes!(status: 'failed', error_message: message, completed_at: Time.now)
  end

  def row_count
    super || ongoing_row_count
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

  def copy_latest_result
    if AwsS3.s3_enabled? && query.present? && query.scheduled_flag
      AwsS3.copy(current_result_s3_key, query.latest_result_key)
    end
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

  def current_result_s3_key
    @result_key ||= CsvHelper::Aws.new(id).key
  end
end
