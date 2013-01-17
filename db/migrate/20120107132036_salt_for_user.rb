class SaltForUser < ActiveRecord::Migration
  def change
    add_column("users","salt",:string)
  end
  def self.down
    remove_column("users","salt",:string)
  end
end
