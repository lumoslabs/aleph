module CsvHelper
  class Aws < Base
    S3_BUCKET = APP_CONFIG['s3_bucket']
    S3_FOLDER = APP_CONFIG['s3_folder'] || 'results'

    def url
      Retriable.with_context(:s3) do
        obj = AwsS3.resource.bucket(S3_BUCKET).object(key)
        return nil unless obj.exists?

        obj.presigned_url(
          :get,
          response_content_disposition: "attachment; filename=result_#{@result_id}.csv",
          expires_in: 3600
        )
      end
    end

    def store!
      Retriable.with_context(:s3) do
        obj = AwsS3.resource.bucket(S3_BUCKET).object(key)
        obj.upload_file(filepath)
      end
    end

    private

    def key
      S3_FOLDER ? "#{S3_FOLDER}/#{filename}" : filename
    end
  end
end
