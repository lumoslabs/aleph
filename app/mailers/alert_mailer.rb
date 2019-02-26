class AlertMailer < ActionMailer::Base
  default from: EMAIL_CONFIG['from']

  def alert_failing_email(alert)
    @alert = alert
    mail(to: @alert.email, subject: "Your Aleph alert '#{@alert.query_title}' has triggered")
  end
end
