module AwsS3
  class << self
    def resource
      @s3 ||= Aws::S3::Resource.new(region: 'us-east-1')
    end
  end
end
