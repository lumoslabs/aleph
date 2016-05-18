module Github
  module Commit
    ENDPOINT = URI.join(Github::ROOT_ENDPOINT, 'repos/', "#{Github::OWNER}/", "#{Github::REPO}/", 'git/', 'commits').to_s

    AUTHOR_KEYS = %w(
      name
      email
      date
    )

    def self.get(sha)
      raise 'invalid sha #{sha} when retrieving github commit' unless Github.valid_sha?(sha)
      resp = Github.get("#{ENDPOINT}/#{sha}")
      raise "Github commit retrieve failed with http code: #{resp.code}" if resp.code != '200'
      ActiveSupport::JSON.decode(resp.body)
    end

    # @param - message: The commit message
    # @param - tree: The SHA of the tree object this commit points to
    # @param - parents: Array of strings. 
    #   The SHAs of the commits that were the parents of this commit. If omitted or empty, the commit will be written as a root commit.
    #   For a single parent, an array of one SHA should be provided; for a merge commit, an array of more than one should be provided.
    # @return - commit sha
    def self.create(message, tree, parents, author={})
      input = {
        'message' => message,
        'tree' => tree,
        'parents' => parents
      }
      author.slice!(*AUTHOR_KEYS)
      input.merge!({'author' => author}) if author.present?
      resp = Github.post(ENDPOINT, input)
      raise "Github commit POST failed with http code: #{resp.code}" if resp.code != '201'
      ActiveSupport::JSON.decode(resp.body)['sha']
    end
  end
end
