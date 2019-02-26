# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20190205234108) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "alerts", force: :cascade do |t|
    t.string   "status"
    t.string   "comparator"
    t.integer  "target"
    t.integer  "query_id"
    t.string   "email"
    t.text     "error_message"
    t.integer  "last_alert_result_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "description"
  end

  create_table "queries", force: :cascade do |t|
    t.string   "title"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "latest_body"
    t.datetime "deleted_at"
    t.boolean  "scheduled_flag", default: false, null: false
    t.string   "email"
  end

  create_table "query_roles", force: :cascade do |t|
    t.integer "query_id"
    t.string  "role"
  end

  add_index "query_roles", ["query_id"], name: "index_query_roles_on_query_id", using: :btree

  create_table "query_versions", force: :cascade do |t|
    t.integer  "query_id"
    t.integer  "version"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "blob_sha",   limit: 40
    t.text     "parameters"
    t.text     "comment"
    t.datetime "deleted_at"
    t.text     "body"
    t.string   "commit_sha", limit: 40
    t.string   "tree_sha",   limit: 40
    t.integer  "user_id"
  end

  add_index "query_versions", ["query_id", "version"], name: "index_query_versions_on_query_id_and_version", using: :btree
  add_index "query_versions", ["user_id"], name: "index_query_versions_on_user_id", using: :btree

  create_table "results", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "status"
    t.text     "error_message"
    t.integer  "query_version_id"
    t.text     "sample_data"
    t.integer  "row_count"
    t.text     "parameters"
    t.text     "headers"
    t.text     "compiled_body"
    t.datetime "started_at"
    t.datetime "deleted_at"
    t.integer  "owner_id"
    t.datetime "completed_at"
  end

  add_index "results", ["query_version_id"], name: "index_results_on_query_version_id", using: :btree

  create_table "schema_comments", force: :cascade do |t|
    t.string  "target_type"
    t.string  "schema"
    t.string  "table"
    t.string  "column"
    t.text    "text"
    t.integer "user_id"
  end

  add_index "schema_comments", ["schema"], name: "index_schema_comments_on_schema", using: :btree

  create_table "sessions", force: :cascade do |t|
    t.string   "session_id", null: false
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["session_id"], name: "index_sessions_on_session_id", using: :btree
  add_index "sessions", ["updated_at"], name: "index_sessions_on_updated_at", using: :btree

  create_table "snippets", force: :cascade do |t|
    t.string   "name"
    t.text     "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "user_id"
  end

  add_index "snippets", ["user_id"], name: "index_snippets_on_user_id", using: :btree

  create_table "taggings", force: :cascade do |t|
    t.integer  "tag_id"
    t.integer  "taggable_id"
    t.string   "taggable_type"
    t.integer  "tagger_id"
    t.string   "tagger_type"
    t.string   "context",       limit: 128
    t.datetime "created_at"
  end

  add_index "taggings", ["tag_id", "taggable_id", "taggable_type", "context", "tagger_id", "tagger_type"], name: "taggings_idx", unique: true, using: :btree
  add_index "taggings", ["taggable_id", "taggable_type", "context"], name: "index_taggings_on_taggable_id_and_taggable_type_and_context", using: :btree

  create_table "tags", force: :cascade do |t|
    t.string  "name"
    t.integer "taggings_count", default: 0
  end

  add_index "tags", ["name"], name: "index_tags_on_name", unique: true, using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "name"
    t.string   "email",               default: "", null: false
    t.string   "encrypted_password",  default: "", null: false
    t.datetime "remember_created_at"
    t.string   "role"
  end

  create_table "versions", force: :cascade do |t|
    t.string   "item_type",  null: false
    t.integer  "item_id",    null: false
    t.string   "event",      null: false
    t.string   "whodunnit"
    t.text     "object"
    t.datetime "created_at"
  end

  add_index "versions", ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id", using: :btree

  create_table "visualizations", force: :cascade do |t|
    t.integer "query_version_id"
    t.text    "html_source"
    t.string  "title"
  end

  add_index "visualizations", ["query_version_id"], name: "index_visualizations_on_query_version_id", using: :btree

end
