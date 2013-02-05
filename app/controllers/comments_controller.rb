class CommentsController < ApplicationController
  respond_to :js, :html

  def index
    if request.xhr?
      layout 'no_layout'
    end
    @comments = Comment.where(:topic_id=>params[:topic_id]).order("comments.position ASC")
    @topic = Topic.where(:id=>params[:topic_id])
  end
  
  def edit
    if request.xhr?
      layout 'no_layout'
    end    @comment = Comment.find(params[:id])
    if @comment.user_id != session[:user_id] then
      redirect_to(:action=>'index',:topic_id=>@comment.topic_id,:notice=>'Only comment submitter may edit the comment.')
      return
    end       
  end
  
#  def create
#    @comment = Comment.new(params[:comment])
#    @comment.user_id = session[:user_id]
#    @comment.topic_id = params[:topic_id]
#    cs=Comment.where(:topic_id=>params[:topic_id])
#    if cs.size>0
#      @comment.position = cs.last.position+1
#    end
#    User.upvote(@comment.user_id)
#    if @comment.save
#      redirect_to(:action=>'index',:topic_id=>params[:topic_id])
#    else
#      flash[:notice] = @comment.errors.full_messages
#    end    
#  end

  def create
    if request.xhr?
      layout 'no_layout'
    end
    if session[:user_id] != '' && session[:user_id] != nil then
      @comment = Comment.new(params[:comment])
      @comment.user_id = session[:user_id]
      @comment.topic_id = params[:topic_id]
#      cs=Comment.where(:topic_id=>params[:topic_id])
#      if cs.size>0
#        @comment.position = cs.last.position
#      end
      cs = Comment.find(:all)
      @comment.position = cs.size
      User.upvote(@comment.user_id)
      if @comment.save
        redirect_to(:action=>'index',:topic_id=>params[:topic_id],:notice=>params[:notice])
      else
        flash[:notice] = @comment.errors.full_messages
      end    
    else
      redirect_to(:action=>'create_acc_and_post',:comment=>params[:comment],:topic_id=>params[:topic_id],:reply=>params[:reply],:notice=>'No personal data (i.e. e-mail) needed to create an account')
    end
  end
    
  def update
    if request.xhr?
      layout 'no_layout'
    end
    @comment = Comment.find(params[:id])    
      if @comment.update_attributes(params[:comment])
        redirect_to(:action=>'index',:topic_id=>@comment.topic_id,:notice=>'The comment has been updated.')
      else
        render('edit')
      end
  end   
  
  def delete
    if request.xhr?
      layout 'no_layout'
    end
    @comment = Comment.find(params[:id])
    if @comment.user_id != session[:user_id] then
      redirect_to(:action=>'index',:topic_id=>@comment.topic_id,:notice=>'Only comment submitter may delete the comment.')
      return
    end     
  end
  
  def destroy
    if request.xhr?
      layout 'no_layout'
    end
    @comment = Comment.find(params[:id])
    @comment.destroy
    redirect_to(:action=>'index',:topic_id=>params[:topic_id],:notice=>'The comment has been permamently deleted.')
  end
  
  def logout
    if request.xhr?
      layout 'no_layout'
    end
    redirect_to(:controller=>'topics', :action=>'logout')
  end

  def upvote
    if request.xhr?
      layout 'no_layout'
    end
    if session[:user_id] == nil    
      redirect_to(:controller=>'topics',:action=>'login',:notice=>'You need to be logged in to upvote.')
      return
    end
    @comment = Comment.find(params[:id])
    if session[:user_id] == @comment.user_id
      redirect_to(:action=>'index',:topic_id=>@comment.topic_id,:notice=>'You can\'t upvote your own comments.')
      return
    end
    @comment.upvoted_by = ' ' if @comment.upvoted_by == nil 
    @comment.upvoted_by += session[:login].to_s+' '    
    @comment.points = @comment.points+1
    @comment.save
    User.upvote(@comment.user_id)
    @comments = Comment.order("comments.position ASC") 
    redirect_to(:action=>'index',:topic_id=>@comment.topic_id,:notice=>params[:notice])
  end
  
  def reply
    if request.xhr?
      layout 'no_layout'
    end
    @previous_comment = Comment.find(params[:id])
    @comment = Comment.new(params[:comment])
    @topic_id = params[:topic_id]
    @json = "{\ncontent: \""+Comment.find(params[:id]).comment+"\"\n}"
=begin
    respond_with @json do |format|
      format.json { render :layout => false, :comment => @comment.to_json }
    end
=end
  end
  
  def replied
    if request.xhr?
      layout 'no_layout'
    end
        @comment = Comment.new(params[:comment])
        @previous_comment = Comment.find(params[:previous_id])
        if session[:user_id] != nil 
          @comment.user_id = session[:user_id]
          @comment.topic_id = @previous_comment.topic_id
          @comment.replyTo = @previous_comment.id
          @comment.tab = @previous_comment.tab+1
          @comment.position = @previous_comment.position+1
          @rest_of_comments = Comment.find(:all, :conditions => ['position > ?', @previous_comment.position])
          @rest_of_comments.each do |c|
            c.position = c.position+1
            c.save
          end
          if @comment.save
            redirect_to(:controller=>'comments',:action=>'index',:topic_id=>@previous_comment.topic_id)
          else
            flash[:notice] = @comment.errors.full_messages
          end    
        else
          redirect_to(:controller=>'comments',:action=>'create_acc_and_post',:topic_id=>@previous_comment.topic_id,:previous_id=>params[:previous_id],:comment=>params[:comment],:notice=>'No personal data (i.e. e-mail) needed to create an account',:reply=>'true')
        end
  end
end
