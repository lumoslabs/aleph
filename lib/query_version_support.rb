module QueryVersionSupport
  def retrieve_query_version
    query_version_id = params.fetch(:query_version_id, 'latest')
    @query_version ||= if query_version_id == 'latest'
      query_versions.first
    else
      QueryVersion.find(query_version_id)
    end
  end

  def query_versions
    QueryVersion.where(query_id: params[:query_id]).order('version DESC')
  end
end
