class CountPublisher
  INCREMENT_SIZE = 1000

  def initialize(redis_row_count)
    @redis_row_count = redis_row_count
    @redis = Redis.current
  end

  def callbacks
    { during_execute: publish_ongoing, after_execute: expire_count }
  end

  private

  def publish_ongoing
    lambda do |_row, row_count|
      if row_count % INCREMENT_SIZE == 0
        @redis_row_count.increment_count_by(INCREMENT_SIZE)
      end
    end
  end

  def expire_count
    ->(_row_count) { @redis_row_count.expire }
  end
end
