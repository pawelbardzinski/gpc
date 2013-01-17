class AddTabToComments < ActiveRecord::Migration
  def change
    add_column("comments","tab",:integer,:default=>0)
  end
  
  def self.down
    remove_column("comments","tab",:integer)
  end
end
