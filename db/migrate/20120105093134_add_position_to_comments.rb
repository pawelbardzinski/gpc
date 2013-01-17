class AddPositionToComments < ActiveRecord::Migration
  def change
    add_column("comments","position",:integer,:default=>1)
  end
  def self.down
    remove_column("comments","position",:integer)
  end
end
