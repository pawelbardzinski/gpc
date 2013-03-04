class AdminController < ApplicationController
  def count_posts
    @posts = []
    @users = User.find(:all)
    @users.each do |user|
      @posts << Topic.where(:id=>user.id).size + Comment.where(:id=>user.id).size
    end
  end

end
