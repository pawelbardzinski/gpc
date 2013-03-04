class AdminController < ApplicationController
  def count_posts
    @posts = []
    @users = User.find(:all)
    @users.each do |user|
      @posts << Topic.where(:user_id=>user.id).size + Comment.where(:user_id=>user.id).size
    end
  end

end
