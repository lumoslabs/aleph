class QueryMailer < ActionMailer::Base
  default from: ALERTS_CONFIG['from']

  def query_result_email(query)
    @query = query
    @presigned_url = AwsS3.presigned_url(@query.latest_result_key, "result_for_query_#{@query.id}.csv", 3600 * 24)
    mail(to: @query.email, subject: "Scheduled Aleph query '#{@query.title}'")
  end
end
