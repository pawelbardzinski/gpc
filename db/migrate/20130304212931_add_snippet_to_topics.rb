class AddSnippetToTopics < ActiveRecord::Migration
  def change
    add_column("topics","snippet",:text)
  end
end
