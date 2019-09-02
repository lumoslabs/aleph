module AlephExecutables
  class SetupMinimal
    def initialize(options)
      @options = options
      @banner = options[:banner]
    end

    def execute!
      options = @options.select{ |k,v| [:config_path, :s3_region, :s3_bucket, :s3_folder, :snowflake_unload_target].include?(k) }
      host = @options[:redshift_host]
      db = @options[:redshift_db]
      port = @options[:redshift_port]
      user = @options[:db_user]
      password = @options[:db_password]
      dsn = @options[:dsn]
      db_type = @options[:db_type] || 'redshift'
      snowflake_unload_target = @options[:snowflake_unload_target]
      s3_bucket = @options[:s3_bucket]

      Utils.fail "Invalid database type (must be redshift or snowflake)", @banner unless ['redshift', 'snowflake'].include?(db_type)
      Utils.fail "Missing DB User", @banner unless present? user
      Utils.fail "Missing DB Password", @banner unless present? password

      if db_type == 'redshift'
        Utils.fail "Missing Redshift Host", @banner unless present? host
        Utils.fail "Missing Redshift Db", @banner unless present? db
        Utils.fail "Missing Redshift Port", @banner unless present? port
      else
        Utils.fail "Missing Snowflake ODBC DSN", @banner unless present? dsn
        Utils.fail "Missing Snowflake Unload Target", @banner unless present? snowflake_unload_target
        Utils.fail "Missing s3 bucket (This is required for Snowflake connection)", @banner unless present? s3_bucket
      end

      Playground.setup db_type, host, dsn, db, port, user, password, options
    end

    def present?(v)
      v && !v.to_s.empty?
    end
  end
end
