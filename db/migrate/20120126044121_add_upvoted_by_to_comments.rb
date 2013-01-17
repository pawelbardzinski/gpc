class AddUpvotedByToComments < ActiveRecord::Migration
  def change
    add_column("comments","upvoted_by",:text)
  end
  
  def self.down
    remove_column("comments","upvoted_by",:text)
  end
end
