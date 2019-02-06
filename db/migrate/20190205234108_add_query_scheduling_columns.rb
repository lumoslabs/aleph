class AddQuerySchedulingColumns < ActiveRecord::Migration
  def change
    add_column :queries, :scheduled_flag, :boolean, null: false, default: false, comment: 'Flag to control query scheduling'
    add_column :queries, :email, :string, comment: 'Email to send results of scheduled query'
  end
end
