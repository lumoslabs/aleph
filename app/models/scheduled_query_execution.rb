class ScheduledQueryExecution
  @queue = :query_exec

  def self.perform(query_id, role)
    query = Query.find(query_id)

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
      query.send_result_email if query.email.present?
    end
  end
end
