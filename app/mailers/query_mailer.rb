class QueryMailer < ActionMailer::Base
  default from: EMAIL_CONFIG['from']

  def query_result_email(query)
    @query = query
    @presigned_url = AwsS3.presigned_url(key, "result_for_query_#{@@query.id}.csv", 3600 * 24)
    mail(to: @query.email, subject: "Scheduled Aleph query '#{@query.title}'")
  end
end
