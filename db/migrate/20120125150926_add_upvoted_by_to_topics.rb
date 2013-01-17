class AddUpvotedByToTopics < ActiveRecord::Migration
  def change
    add_column("topics","upvoted_by",:text)
  end
  
  def self.down
    remove_column("topics","upvoted_by",:text)
  end
end
