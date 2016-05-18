require 'json'

module Schemas
  module RedisStore

    EXPIRE = 3.days

    def redis_retrieve
      r = Redis.current.get(key)
      r ? JSON.parse(r) : []
    end

    def redis_store!(schema_rows)
      Redis.current.del(key)
      Redis.current.set(key, JSON.generate(schema_rows))

      # should be deleting the key before we store
      # but set expire just in case we switch keys in the code
      Redis.current.expire(key, EXPIRE)
    end
  end
end
