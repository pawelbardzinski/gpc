class AddRepliedToComments < ActiveRecord::Migration
  def change
    add_column("comments","replyTo",:integer,:default=>0)
  end
  
  def self.down
    remove_column("comments","replyTo",:integer)
  end
end
