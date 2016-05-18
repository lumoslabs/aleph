module AlephExecutables
  class Seeder
    PLAYGROUND_DATA_PATH        = 'playground_data'.freeze
    PLAYGROUND_DB_SEED_FILE     = 'aleph.playground.sqlite3'.freeze
    PLAYGROUND_SEED_RESULT_FILE = '1.csv'.freeze
    LOCAL_RESULT_CSV            = 'public/local_result_csvs'

    def self.execute!
      FileUtils.cp(File.join(PLAYGROUND_DATA_PATH, PLAYGROUND_DB_SEED_FILE), File.join('db', PLAYGROUND_DB_SEED_FILE))
      FileUtils.mkdir_p(LOCAL_RESULT_CSV)
      FileUtils.cp(File.join(PLAYGROUND_DATA_PATH, PLAYGROUND_SEED_RESULT_FILE), File.join(LOCAL_RESULT_CSV, PLAYGROUND_SEED_RESULT_FILE))
    end
  end
end
