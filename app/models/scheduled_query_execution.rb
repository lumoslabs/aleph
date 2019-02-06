class ScheduledQueryExecution
  @queue = :query_exec

  def self.perform(alert_id, role)
    query = Query.find(alert_id)

    interaction = Interaction::ResultCreation.new(
      query_version_id: query.latest_query_version.id,
      owner: query.user
    )

    result = interaction.execute

    if interaction.errors.any?
      query.error(interaction.errors.join(', '))
    else
      query.add_result(result)
      query.save!
      QueryExecution.perform(result.id, role)
      query.send_result_email
    end
  end
end