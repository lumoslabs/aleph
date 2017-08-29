module Admin
  class RunningResultsController < BaseController

    RUNNING_RESULTS = <<-SQL
      select
        title query_title,
        TO_CHAR(results.started_at, 'YYYY-MM-DD HH24:MI:SS') started_at,
        ROUND(EXTRACT(EPOCH FROM (now() - results.started_at)::INTERVAL)) duration_seconds,
        users.name author,
        users.role author_role,
        queries.id query_id,
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
          render json: ActiveRecord::Base.connection.exec_query(RUNNING_RESULTS)
        end
      end
    end
  end
end
