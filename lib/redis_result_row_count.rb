class RedisResultRowCount
  EXPIRY = 1.hour

  def initialize(result)
    @result = result
    @redis = Redis.current
  end

  def ongoing_row_count
    @redis.get(redis_key)
  end

  def increment_count_by(amount)
    @redis.incrby(redis_key, amount)
  end

  def expire
    @redis.expire(redis_key, EXPIRY)
  end

  private

  def redis_key
    "{@result.id}_rowcount"
  end
end
