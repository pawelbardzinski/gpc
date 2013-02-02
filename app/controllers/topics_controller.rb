class TopicsController < ApplicationController

  def index
    list
    render('list')
  end
  
  def list
    @topics = []
    if params[:commit] && params[:search_string] != ''
      search_string = params[:search_string]
      search_string.gsub!(' ','%')
      search_string = '%'+search_string+'%'
      sql_search_in_subject = 'select * from topics where subject like \''+search_string+'\' order by updated_at'
      sql_search_in_text = 'select * from topics where text like \''+search_string+'\' order by updated_at'
      sql_search_in_comments = 'select * from topics where id in (select distinct topic_id from comments where comment like \''+search_string+'\') order by updated_at'
      @topics = ActiveRecord::Base.connection.execute(sql_search_in_subject).to_a + ActiveRecord::Base.connection.execute(sql_search_in_text).to_a + ActiveRecord::Base.connection.execute(sql_search_in_comments).to_a
    else
      @topics = Topic.order("topics.position DESC")
    end
    @next=params[:next].to_i+1
  end
  helper_method :list
  
  def chart
    @topics = Topic.order("topics.position DESC")
    @topics = @topics[0..30]
  end
  
  def show
    @topic = Topic.find(params[:id])
  end
  
  def new
#    if session[:user_id]
      @topic = Topic.new()
#    else
#      redirect_to(:action => 'login',:notice=>"You need to be logged in to submit.")
#    end
  end
  
  def edit
    @topic = Topic.find(params[:id])
  end
  
  def create_account
    new_user = User.create(params[:login],params[:password])
    if (new_user)
      if new_user.save
        session[:user_id] = new_user.id
        session[:login] = new_user.login      
        if params[:topic] != nil
          redirect_to(:action=>'create',:topic=>params[:topic],:notice=>'Thread added. User \''+new_user.login+'\' created succesfuly.')
          return
        end
        flash[:notice] = "User #{new_user.login} created."
        if params[:comment] != '' && params[:topic_id] != nil
          if params[:reply] == "false"
            redirect_to(:controller=>'comments',:action=>'create',:topic_id=>params[:topic_id],:comment=>params[:comment],:notice=>'Your comment has been published. User \''+new_user.login+'\' created successfuly.',:reply=>params[:reply])
            return
          else
            redirect_to(:controller=>'comments',:action=>'replied',:topic_id=>params[:topic_id],:comment=>params[:comment],:notice=>'Your comment has been published. User \''+new_user.login+'\' created successfuly.',:previous_id=>params[:previous_id])            
            return
        end
        end
        if params[:topic_id] == '' || params[:topic_id] == nil
          redirect_to(:action=>'list',:notice=>'User \''+new_user.login+'\' created successfuly. Start by adding your thread or post a comment!')
          return
        else
          if params[:reply] == "false"
            redirect_to(:controller=>'comments',:action=>'create',:topic_id=>params[:topic_id],:comment=>params[:comment],:notice=>'Your comment has been published. User \''+new_user.login+'\' created successfuly.',:reply=>params[:reply])
            return
          else
            redirect_to(:controller=>'comments',:action=>'replied',:topic_id=>params[:topic_id],:comment=>params[:comment],:notice=>'Your comment has been published. User \''+new_user.login+'\' created successfuly.',:previous_id=>params[:previous_id])            
            return
          end
        end
      else
        notice = ''
        if params[:login].size<4 || params[:password].size<4
          notice="User creation failed. Minimum username and password length is 4 characters."
        else
          notice="The username already exists. Please choose a different one."
        end
#          redirect_to(:action=>'login',:notice=>notice,:topic_id=>params[:topic_id])       
            if params[:topic_id] != '' && params[:topic_id] != nil
              redirect_to(:controller=>'comments',:action=>'create_acc_and_post',:notice=>notice,:topic_id=>params[:topic_id],:comment=>params[:comment])
            else
              redirect_to(:action=>'login',:notice=>notice,:topic_id=>params[:topic_id])       
            end
          return
      end        
    end
  end
  
  def attempt_login
    authorized_user = User.authenticate(params[:login],params[:password])
    @topic_id = params[:topic_id]
    if (authorized_user)
      session[:user_id] = authorized_user.id
      session[:login] = authorized_user.login
      if params[:topic] != nil
        redirect_to(:action=>'create',:topic=>params[:topic])
        return
      end
      flash[:notice] = "You are now logged in."
      if params[:topic_id] == '' || params[:topic_id] == nil 
        redirect_to(:action => 'list',:notice=>"You are now logged in as \'"+params[:login]+'\'.')
      else
#        redirect_to(:controller=>'comments',:action=>'index',:topic_id=>@topic_id,:notice=>"You are now logged in as \'"+params[:login]+'\'.')
        if params[:reply] == 'false'
          redirect_to(:controller=>'comments',:action=>'create',:comment=>params[:comment],:topic_id=>params[:topic_id],:notice=>'You are now logged in. Your reply has been posted.')
          return
        else
          redirect_to(:controller=>'comments',:action=>'replied',:comment=>params[:comment],:topic_id=>params[:topic_id],:previous_id=>params[:previous_id],:notice=>'You are now logged in. Your reply has been posted.')
          return
        end
      end
    else
      redirect_to(:action => 'login',:notice=>'Wrong username or password. Please try again.')
    end
  end
  
  def login
    flash[:notice] = params[:notice]
    @topic_id = params[:topic_id]
  end
  
  def logout
    session[:user_id] = nil
    session[:login] = nil
    redirect_to(:action=>'list',:notice=>"You have been logged out.")
  end
  
  def upvote
    if session[:user_id] == nil    
      redirect_to(:controller=>'topics',:action=>'login',:notice=>'You need to be logged in to upvote.')
      return
    end
    @topic = Topic.find(params[:id])
    if session[:user_id] == @topic.user_id
      redirect_to(:action=>'list',:notice=>'You can\'t upvote your own Posts.')
      return
    end
    @topic.position = (@topic.points+1).to_f/(((Time.now.to_f+60000-@topic.created_at.strftime("%s").to_f)/1000))
    @topic.points = @topic.points+1
    @topic.upvoted_by = ' ' if @topic.upvoted_by == nil
    @topic.upvoted_by << session[:login].to_s+' '
    @topic.save
    User.upvote(@topic.user_id)    
    @topics = Topic.order("topics.position DESC") 
    redirect_to(:action=>'list')
  end
  
  def update
    @topic = Topic.find(params[:id])
    if @topic.user_id != session[:user_id] then
      redirect_to(:action=>'list',:notice=>'Only topic submitter may edit the topic.')
      return
    end     
    @topic.position=@topic.id
    if @topic.url != '' and @topic.text != ''
      redirect_to(:action=>'new',:notice=>'submit text -or- link.')
      return
    end
    if @topic.url == '' and @topic.text == ''
      redirect_to(:action=>'new',:notice=>'text -or- link not submitted.')
      return
    end
    if @topic.subject.size < 4
        redirect_to(:action=>'new',:notice=>'submitted title must be at least four characters long.')
        return
    end
    if @topic.url == '' and @topic.text.size < 2
      redirect_to(:action=>'new',:notice=>'submitted text must be at least two characters long.')
      return
    end
    if (@topic.url =~ URI::regexp).nil? and @topic.text == '' and @topic.url != ''
        redirect_to(:action=>'new',:notice=>'submitted link is not valid.')
        return
    end
    if @topic.update_attributes(params[:topic])
      redirect_to(:action=>'list',:id=>@topic.id)
    else
      render('edit')
    end
  end   
  
  def create
    if session[:user_id] != nil
      @topic = Topic.new(params[:topic])
      @topic.user_id = session[:user_id]
      if @topic.url != '' and @topic.text != ''
        redirect_to(:action=>'new',:notice=>'submit text -or- link.')
        return
      end
      if @topic.url == '' and @topic.text == ''
        redirect_to(:action=>'new',:notice=>'text -or- link not submitted.')
        return
      end
      if @topic.subject.size < 4
        redirect_to(:action=>'new',:notice=>'submitted title must be at least four characters long.')
        return
      end
      if @topic.url == '' and @topic.text.size < 2
        redirect_to(:action=>'new',:notice=>'submitted text must be at least two characters long.')
        return
      end
      if (@topic.url =~ URI::regexp).nil? and @topic.text == '' and @topic.url != ''
        redirect_to(:action=>'new',:notice=>'submitted link is not valid.')
        return
      end
      if @topic.save
        @topic.position = (@topic.points+1).to_f/(((Time.now.to_f+60000-@topic.created_at.strftime("%s").to_f)/1000))
        @topic.points = @topic.points+1
        @topic.save       
        User.upvote(@topic.user_id)   
        redirect_to(:action=>'list',:notice=>params[:notice])
      else
        render('new')
      end
    else
      @topic = Topic.new(params[:topic])
      if @topic.url != '' and @topic.text != ''
        redirect_to(:action=>'new',:notice=>'submit text -or- link.')
        return
      end
      if @topic.url == '' and @topic.text == ''
        redirect_to(:action=>'new',:notice=>'text -or- link not submitted.')
        return
      end
      if @topic.subject.size < 4
        redirect_to(:action=>'new',:notice=>'submitted title must be at least four characters long.')
        return
      end
      if @topic.url == '' and @topic.text.size < 2
        redirect_to(:action=>'new',:notice=>'submitted text must be at least two characters long.')
        return
      end
      if (@topic.url =~ URI::regexp).nil? and @topic.text == '' and @topic.url != ''
        redirect_to(:action=>'new',:notice=>'submitted link is not valid.')
        return
      end    
      redirect_to(:controller=>'topics',:action=>'create_acc_and_post_topic',:topic=>params[:topic],:notice=>'e-mail not required to create account')
    end
  end
  
  def delete
    @topic = Topic.find(params[:id])
    if @topic.user_id != session[:user_id] then
      redirect_to(:action=>'list',:notice=>'Only topic submitter may delete the topic.')
      return
    end 
  end
  
  def destroy
    @topic = Topic.find(params[:id])
    @topic.destroy
    redirect_to(:action=>'list')
  end
  
end
