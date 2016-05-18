module AlephExecutables
  class SeedPlaygroundDb
    def initialize(options); end

    def execute!
      Seeder.execute!
    end
  end
end
