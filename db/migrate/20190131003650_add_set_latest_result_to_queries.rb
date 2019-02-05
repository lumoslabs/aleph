class AddSetLatestResultToQueries < ActiveRecord::Migration
  def change
    add_column :queries, :latest_result_s3_url_flag, :boolean, null: false, default: false, comment: 'Flag for if aleph will write latest result to consistent s3 location'
  end
end
