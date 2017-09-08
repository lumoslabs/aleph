class CsvService
  attr_reader :service_impl
  delegate :url, :store!, :filepath, :filename, to: :service_impl

  def initialize(result_id)
    if APP_CONFIG['s3_bucket']
      @service_impl = CsvHelper::Aws.new(result_id)
    else
      @service_impl = CsvHelper::Local.new(result_id)
    end
  end

  def clear_tmp_file
    File.delete(filepath) if File.exist?(filepath)
  end
end
