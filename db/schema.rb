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
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120504104309) do

  create_table "comments", :force => true do |t|
    t.text     "comment"
    t.integer  "user_id"
    t.integer  "topic_id"
    t.integer  "points",     :default => 1
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "position",   :default => 1
    t.integer  "replyTo",    :default => 0
    t.integer  "tab",        :default => 0
    t.text     "upvoted_by"
  end

  add_index "comments", ["topic_id"], :name => "index_comments_on_topic_id"
  add_index "comments", ["user_id"], :name => "index_comments_on_user_id"

  create_table "topics", :force => true do |t|
    t.string   "subject"
    t.string   "url",        :limit => 2000
    t.float    "position",                   :default => 0.0
    t.integer  "user_id"
    t.integer  "points",                     :default => 0
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "text"
    t.text     "upvoted_by"
  end

  add_index "topics", ["user_id"], :name => "index_topics_on_user_id"

  create_table "users", :force => true do |t|
    t.string   "login",           :limit => 25
    t.string   "password",        :limit => 40
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "karma",                         :default => 0
    t.string   "salt"
    t.string   "hashed_password"
  end

end
