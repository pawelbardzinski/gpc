class InitialMigration < ActiveRecord::Migration
  def up
    create_table :users do |t|
      t.string "login", :limit => 25
      t.string "password", :limit => 40
      t.timestamps
    end
    create_table :topics do |t|
      t.string "subject"
      t.string "url", :limit => 2000
      t.float "position", :default => 0
      t.integer "user_id"
      t.integer "points", :default => 0
      t.timestamps
    end
    create_table :comments do |t|
      t.text "comment"
      t.integer "user_id"
      t.integer "topic_id"
      t.integer "points", :default => 1
      t.timestamps
    end
    add_index("topics","user_id")
    add_index("comments","user_id")
    add_index("comments","topic_id")
  end

  def down
    remove_index("topics","user_id")
    remove_index("comments","user_id")
    remove_index("comments","topic_id")
    drop_table :users
    drop_table :topics
    drop_table :comments
  end
end
