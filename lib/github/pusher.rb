module Github
  class Pusher
    TREE_QUERY = %w(
      SELECT
        q.id as query_id, blob_sha
      FROM queries q
      JOIN (
        SELECT
          qv2.query_id, qv2.blob_sha FROM query_versions qv2
        JOIN (
          SELECT
            query_id, max(version) max FROM query_versions group by 1
          ) qv3
          ON qv2.query_id=qv3.query_id
          AND qv2.version = qv3.max
        ) qv
      ON q.id = qv.query_id
      AND coalesce(qv.blob_sha, '') != ''
    ).join(' ')

    LAST_SHAS = %w(
      SELECT
        tree_sha, commit_sha
      FROM query_versions
      WHERE coalesce(tree_sha, '') != ''
        AND coalesce(commit_sha, '') != ''
      ORDER BY id DESC
      LIMIT 1
    ).join(' ')

    def create_blob(body)
      blob_sha = Blob.create(body)
      raise "Error: invalid blob_sha #{blob_sha}" unless valid_sha?(blob_sha)
      blob_sha
    end

    def create_tree(query_id, blob_sha, base_tree)
      tree = {}
      ActiveRecord::Base.connection.execute(TREE_QUERY).each do |query|
        tree[query['query_id'].to_s] = to_tree_hash(query['query_id'], query['blob_sha'])
      end
      tree[query_id.to_s] = to_tree_hash(query_id, blob_sha)

      tree_sha = Tree.create(tree.values, base_tree)
      raise "Error: invalid tree_sha #{tree_sha}" unless valid_sha?(tree_sha)
      tree_sha
    end

    def create_commit(query_id, tree_sha, parent_commit_sha, version, author, email)
      author = {
        'name' => author,
        'email' => email,
        'date' => DateTime.now.utc.strftime('%Y-%m-%dT%H:%M:%SZ')
      }

      parents = parent_commit_sha.nil? ? [] : [parent_commit_sha]
      commit_sha = Commit.create("Version #{version} for query #{query_id}", tree_sha, parents, author)
      raise "Error: invalid commit_sha #{commit_sha}" unless valid_sha?(commit_sha)
      commit_sha
    end

    def git_push(query_id, body, version, author, email)
      last_shas = ActiveRecord::Base.connection.execute(LAST_SHAS).first
      base_tree = nil
      parent_commit_sha = nil
      if last_shas
        base_tree = last_shas['tree_sha']
        parent_commit_sha = last_shas['commit_sha']
      end

      blob_sha = create_blob(body)
      tree_sha = create_tree(query_id, blob_sha, base_tree)
      commit_sha = create_commit(query_id, tree_sha, parent_commit_sha, version, author, email)
      Refs.update(APP_CONFIG['github_ref'], commit_sha)

      [blob_sha, commit_sha, tree_sha]
    end

    private

    def valid_sha?(sha)
      sha.size == 40 && sha =~ /^[0-9A-F]+$/i
    end

    def to_tree_hash(query_id, blob_sha)
      {
        'path' => "query_#{query_id}",
        'mode' => '100644',
        'type' => 'blob',
        'sha' => blob_sha
      }
    end
  end
end
