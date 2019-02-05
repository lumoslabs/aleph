module CsvHelper
  class Aws < Base
    def url
      Pester.s3.retry do
        obj = AwsS3.object(key)
        if obj.exists?
          obj.presigned_url(:get, response_content_disposition: "attachment; filename=result_#{@result_id}.csv", expires_in: 3600)
        else
          nil
        end
      end
    end

    def store!
      Pester.s3.retry do
        obj = AwsS3.object(key)
        obj.upload_file(filepath)
      end
    end

    def key
      AwsS3::S3_FOLDER ? "#{AwsS3::S3_FOLDER}/#{filename}" : filename
    end
  end
end
