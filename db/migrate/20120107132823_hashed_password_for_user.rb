class HashedPasswordForUser < ActiveRecord::Migration
  def change
    add_column("users","hashed_password",:string)
  end
  def self.down
    remove_column("users","hashed_password",:string)
  end
end
