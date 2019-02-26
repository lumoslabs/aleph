class AddQuerySchedulingColumns < ActiveRecord::Migration
  def up
    add_column :queries, :scheduled_flag, :boolean, null: false, default: false, comment: 'Flag to control query scheduling'
    add_column :queries, :email, :string, comment: 'Email to send results of scheduled query'
    remove_column :queries, :latest_result_s3_url_flag
  end

  def down
    remove_column :queries, :scheduled_flag
    remove_column :queries, :email
    add_column :queries, :latest_result_s3_url_flag, :boolean, null: false, default: false, comment: 'Flag for if aleph will write latest result to consistent s3 location'
  end
end
