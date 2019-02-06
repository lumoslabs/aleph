module AwsS3
  S3_REGION = APP_CONFIG['s3_region'] || 'us-east-1'
  S3_BUCKET = APP_CONFIG['s3_bucket']
  S3_FOLDER = APP_CONFIG['s3_folder'] || 'results'

  class << self
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
      S3_REGION.present? && S3_BUCKET.present?
    end

    def presigned_url(key, filename, expires_in)
      Pester.s3.retry do
        obj = object(key)
        if obj.exists?
          obj.presigned_url(:get, response_content_disposition: "attachment; filename=#{filename}", expires_in: expires_in)
        else
          nil
        end
      end
    end

    def store(key, filepath)
      Pester.s3.retry do
        obj = AwsS3.object(key)
        obj.upload_file(filepath)
      end
    end
  end
end
