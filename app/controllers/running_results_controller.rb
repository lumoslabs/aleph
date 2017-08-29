class RunningResultsController < ApplicationController

  RUNNING_RESULTS = <<-SQL
    select
      title as query_title,
      results.created_at,
      users.name as owner,
      users.role as owner_role,
      queries.id as query_id,
      query_versions.id as query_version_id,
      version
    from results
      join query_versions on query_versions.id = results.query_version_id
      join queries on query_versions.query_id = queries.id
      join users on results.owner_id = users.id
  SQL

  respond_to :json

  def index
    respond_to do |format|
      format.html
      format.json do

        render json: ActiveRecord::Base.connection.execute(RUNNING_RESULTS).to_json
      end
    end
  end
end

#where status = 'running'
