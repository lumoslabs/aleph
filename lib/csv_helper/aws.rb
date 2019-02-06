module CsvHelper
  class Aws < Base
    def url
      AwsS3.presigned_url(key, "result_#{@result_id}.csv", 3600)
    end

    def store!
      AwsS3.store(key, filepath)
    end

    def key
      AwsS3::S3_FOLDER ? "#{AwsS3::S3_FOLDER}/#{filename}" : filename
    end
  end
end
