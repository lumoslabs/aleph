# Interface for the Github API (V3)
module Github
  ROOT_ENDPOINT   = 'https://api.github.com'
  APP_NAME        = APP_CONFIG['github_app_name']
  OWNER           = APP_CONFIG['github_owner']
  REPO            = APP_CONFIG['github_repo']
  REQUEST_PARAMS = {
    'access_token' => ENV['GITHUB_APPLICATION_ACCESS_TOKEN'],
    'client_id' => ENV['GITHUB_APPLICATION_CLIENT_ID'],
    'client_secret' => ENV['GITHUB_APPLICATION_CLIENT_SECRET']
  }
  VALID_VERBS = {
    get: Net::HTTP::Get,
    post: Net::HTTP::Post,
    patch: Net::HTTP::Patch
  }

  def self.enabled?
    APP_NAME.present? && OWNER.present? && REPO.present?
  end

  def self.pusher
    @pusher ||= Pusher.new
  end

  def self.send_request(verb, url, params={})
    raise "invalid HTTP verb #{verb}" unless VALID_VERBS.include?(verb)

    query_params = REQUEST_PARAMS
    query_params.merge!(params) if verb == :get
    url += "?#{query_params.to_query}"

    uri = URI.parse(url)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_PEER

    request = VALID_VERBS[verb].new(uri.request_uri)
    request['Accept'] = 'application/vnd.github.v3+json'
    request['User-Agent'] = APP_NAME

    if request.request_body_permitted?
      request.body = params.to_json
      request.content_type = 'application/json'
    end

    Retriable.retriable { http.request(request) }
  end

  def self.get(url, params={})
    send_request(:get, url, params)
  end

  def self.post(url, params={})
    send_request(:post, url, params)
  end

  def self.patch(url, params={})
    send_request(:patch, url, params)
  end

  def self.valid_sha?(sha)
    sha.present? && sha.length == 40 && sha =~ /^[0-9A-F]+$/i
  end
end
