class QueryMailer < ActionMailer::Base
  default from: EMAIL_CONFIG['from']

  def query_result_email(query)
    @query = query
    @presigned_url = AwsS3.presigned_url(@query.latest_result_key, "result_for_query_#{@query.id}.csv", 3600 * 24)
    Rails.logger.error("Could not generate presigned_url for query id = #{@query.id}, make sure #{@query.latest_result_object_url} exists?") unless @presigned_url.present?
    mail(to: @query.email, subject: "Scheduled Aleph query '#{@query.title}'")
  end
end
