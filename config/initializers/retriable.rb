Retriable.configure do |c|
  c.contexts[:schema_refresh] = {
    base_interval: 3,
    tries: 15
  }

  c.contexts[:s3] = {
    base_interval: 30,
    multiplier: 1,
    tries: 10,
    on_retry: Proc.new do |exception|
      # Don't allow retries of misconfigured AWS key errors
      raise exception if [Aws::S3::Errors::NoSuchKey, Aws::S3::Errors::NoSuchBucket].include?(exception.class)
    end
  }
end
