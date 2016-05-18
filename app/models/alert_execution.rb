class AlertExecution
  @queue = :alert_exec

  def self.perform(alert_id, role)
    alert = Alert.find(alert_id)
    alert.status = Alert::STATUSES.pending
    alert.save!

    interaction = Interaction::ResultCreation.new(
      query_version_id: alert.latest_query_version.id,
      owner: alert.user
    )

    result = interaction.execute

    if interaction.errors.any?
      alert.error(interaction.errors.join(', '))
    else
      alert.last_alert_result = result
      alert.save!
      QueryExecution.perform(result.id, role)
      alert.check_last_result
    end
  end
end
