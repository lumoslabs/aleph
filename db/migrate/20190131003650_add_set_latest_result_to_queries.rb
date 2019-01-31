class AddSetLatestResultToQueries < ActiveRecord::Migration
  def change
    add_column :queries, :set_latest_result, :boolean, null: false, default: false, comment: 'Flag for if aleph will write latest result to consistent s3 location'
  end
end
