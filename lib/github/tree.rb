module Github
  module Tree
    ENDPOINT = URI.join(Github::ROOT_ENDPOINT, 'repos/', "#{Github::OWNER}/", "#{Github::REPO}/", 'git/', 'trees').to_s

    def self.get(sha, recursive=false)
      raise 'invalid sha #{sha} when retrieving github tree' unless Github.valid_sha?(sha)
      params = recursive ? { 'recursive' => 1 } : {}
      resp = Github.get("#{ENDPOINT}/#{sha}", params)
      raise "Github tree retrieve failed with http code: #{resp.code}" if resp.code != '200'
      ActiveSupport::JSON.decode(resp.body)
    end


    # @param - tree: array of hashes. Objects (of path, mode, type, and sha) specifying a tree structure
    # @param - base_tree: The SHA1 of the tree you want to update with new data. If you don’t set this, the commit will be created on top of everything;
    #   however, it will only contain your change, the rest of your files will show up as deleted.
    def self.create(tree, base_tree)
      return unless tree.instance_of?(Array)
      params = {
        'base_tree' => base_tree,
        'tree' => tree
      }

      resp = Github.post(ENDPOINT, params)
      raise "Github tree POST failed with http code: #{resp.code}\nBody is: #{resp.body}" if resp.code != '201'
      ActiveSupport::JSON.decode(resp.body)['sha']
    end
  end
end
