class AddKarmaToUsers < ActiveRecord::Migration
  def change
    add_column("users","karma",:integer,:default=>0)
  end
  def self.down
    remove_column("users","karma",:integer)
  end
end
