module AwsS3
  class << self
    S3_REGION = APP_CONFIG['s3_region'] || 'us-east-1'

    def resource
      @s3 ||= Aws::S3::Resource.new(region: S3_REGION)
    end
  end
end
