module AwsS3
  class << self
    S3_REGION = APP_CONFIG['s3_region'] || 'us-east-1'
    S3_BUCKET = APP_CONFIG['s3_bucket'].freeze

    def resource
      @resource ||= Aws::S3::Resource.new(region: S3_REGION)
    end

    def client
      @client ||= Aws::S3::Client.new(region: S3_REGION)
    end

    def bucket
      @bucket ||= resource.bucket(S3_BUCKET)
    end

    def object(key)
      bucket.object(key)
    end

    # An intra bucket copy
    def copy(source_key, target_key)
      client.copy_object(bucket: S3_BUCKET, copy_source: S3_BUCKET + '/' + source_key, key: target_key)
    end

    def s3_enabled?
      S3_REGION.present && S3_BUCKET.present?
    end

    def latest_result_key(query_id)
      "latest_#{S3_FOLDER}/#{query_id}.csv"
    end
  end
end
