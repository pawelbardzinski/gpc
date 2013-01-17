class AddTextToTopic < ActiveRecord::Migration
  def change
      add_column("topics","text",:text)
    end
    def self.down
      remove_column("topics","text",:text)
    end
end
