module Github
  module Refs
    ENDPOINT = URI.join(Github::ROOT_ENDPOINT, 'repos/', "#{Github::OWNER}/", "#{Github::REPO}/", 'git/', 'refs').to_s

    def self.get(ref)
      resp = Github.get("#{ENDPOINT}/#{ref}")
      raise "Github refs POST failed with http code: #{resp.code}" if resp.code != '200'
      ActiveSupport::JSON.decode(resp.body)
    end

    def self.get_all
      resp = Github.get(ENDPOINT)
      raise "Github refs POST failed with http code: #{resp.code}" if resp.code != '200'
      ActiveSupport::JSON.decode(resp.body)
    end

    def self.create(ref, sha)
      ref = "refs/#{ref}"
      params = {
        'ref' => ref,
        'sha' => sha
      }

      resp = Github.post(ENDPOINT, params)
      raise "Github refs POST failed with http code: #{resp.code}" if resp.code != '201'
      ActiveSupport::JSON.decode(resp.body)
    end

    def self.update(ref, sha)
      params = {
        'sha' => sha,
        'force' => true
      }
      resp = Github.patch("#{ENDPOINT}/#{ref}", params)
      raise "Github refs update failed with http code: #{resp.code}" if resp.code != '200'
      ActiveSupport::JSON.decode(resp.body)
    end
  end
end
