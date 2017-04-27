Pester.configure do |c|
  c.logger = Rails.logger

  c.environments[:schema_refresh] = {
    delay_interval:      1,
    max_attempts:        12,
    on_retry:            Pester::Behaviors::Sleep::Linear
  }

  c.environments[:s3] = {
    delay_interval: 30.seconds,
    max_attempts: 10,
    on_retry: Pester::Behaviors::Sleep::Constant,
    reraise_error_classes: [Aws::S3::Errors::NoSuchKey, Aws::S3::Errors::NoSuchBucket]
  }
end
