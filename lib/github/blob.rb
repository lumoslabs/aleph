module Github
  module Blob
    ENDPOINT = URI.join(Github::ROOT_ENDPOINT, 'repos/', "#{Github::OWNER}/", "#{Github::REPO}/", 'git/', 'blobs').to_s
    
    def self.get(sha)
      raise 'invalid sha #{sha} when retrieving github blob' unless Github.valid_sha?(sha)
      resp = Github.get("#{ENDPOINT}/#{sha}")
      raise "Github blob retrieve failed with http code: #{resp.code}" if resp.code != '200'
      ActiveSupport::JSON.decode(resp.body)
    end

    def self.create(content, encoding='utf-8')
      input = {
        'content' => content,
        'encoding' => encoding
      }

      resp = Github.post(ENDPOINT, input)
      raise "Github blob POST failed with http code: #{resp.code}" if resp.code != '201'
      ActiveSupport::JSON.decode(resp.body)['sha']
    end
  end
end
