class TopicsController < ApplicationController
  def index
    list
    render('list')
  end
  
  def list
    @topics = Topic.order("topics.position ASC")
    @next=params[:next].to_i+1
  end
  
  def show
    @topic = Topic.find(params[:id])
  end
  
  def new
    if session[:user_id]
      @topic = Topic.new()
    else
      redirect_to(:action => 'login',:notice=>"You need to be logged in to submit.")
    end
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
        flash[:notice] = "User #{new_user.login} created."
        redirect_to(:action=>'list')
      else
        notice = ''
        if params[:login].size<4 || params[:password].size<4
          notice="User creation failed. Minimum username and password length is 4 characters."
        else
          notice="The username already exists. Please choose a different one."
        end
          redirect_to(:action=>'login',:notice=>notice)          
      end        
    end
  end
  
  def attempt_login
    authorized_user = User.authenticate(params[:login],params[:password])
    if (authorized_user)
      session[:user_id] = authorized_user.id
      session[:login] = authorized_user.login
      redirect_to(:action => 'list',:notice=>"You are now logged in.")
    else
      redirect_to(:action => 'login',:notice=>params[:notice])
    end
  end
  
  def login
    flash[:notice] = params[:notice]
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
    @topic.position = (@topic.points+1).to_f/(((Time.now.to_f-@topic.created_at.strftime("%s").to_f)/60)-59.0)
    @topic.points = @topic.points+1
    @topic.upvoted_by = ' ' if @topic.upvoted_by == nil
    @topic.upvoted_by << session[:login].to_s+' '
    @topic.save
    User.upvote(@topic.user_id)    
    @topics = Topic.order("topics.position ASC") 
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
      @topic.position = (@topic.points+1).to_f/(((Time.now.to_f-@topic.created_at.strftime("%s").to_f)/60))
      @topic.points = @topic.points+1
      @topic.save       
      User.upvote(@topic.user_id)   
      redirect_to(:action=>'list')
    else
      render('new')
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
