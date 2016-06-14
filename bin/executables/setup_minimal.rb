module AlephExecutables
  class SetupMinimal
    def initialize(options)
      @options = options
      @banner = options[:banner]
    end

    def execute!
      options = @options.select{ |k,v| k == :config_path}
      host = @options[:redshift_host]
      db = @options[:redshift_db]
      port = @options[:redshift_port]
      user = @options[:redshift_user]
      password = @options[:redshift_password]

      Utils.fail "Missing Redshift Host", @banner unless present? host
      Utils.fail "Missing Redshift Db", @banner unless present? db
      Utils.fail "Missing Redshift Port", @banner unless present? port
      Utils.fail "Missing Redshift User", @banner unless present? user
      Utils.fail "Missing Redshift Password", @banner unless present? password

      Playground.setup host, db, port, user, password, options
    end

    def present?(v)
      v && !v.to_s.empty?
    end
  end
end
