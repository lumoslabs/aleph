module AlephExecutables
  class SetupDemo
    HOST             = 'aleph-public.cdiwpivlvfxt.us-east-1.rds.amazonaws.com'.freeze
    DB               = 'aleph_public'.freeze
    PORT             = '5432'.freeze
    USER             = 'read_only'.freeze
    PASSWORD         = '@lephR3@d0nlee'.freeze

    def initialize(options)
      @options = options
    end

    def execute!
      options = @options.select{ |k,v| k == :config_path}.merge(seed_db: true)
      Playground.setup(HOST, DB, PORT, USER, PASSWORD, options)
    end
  end
end
