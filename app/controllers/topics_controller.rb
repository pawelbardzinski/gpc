class TopicsController < ApplicationController

  def index
    list
    render('list')
  end

  def crossdomain
    render('crossdomain', :layout => false)
  end
  
  def list
      @topics = []
      @sort_by = params[:sort]
      if params[:search_string].to_s == ''
        if params[:sort] == 'popularity' 
          sql = 'select * from topics order by position ASC'
          @topics = ActiveRecord::Base.connection.execute(sql).to_a 
          @topics.uniq!
        else
          sql = 'select * from topics order by created_at DESC'
          @topics = ActiveRecord::Base.connection.execute(sql).to_a 
          @topics.uniq!
        end
        @next=params[:next].to_i+1
        @search_string = params[:search_string]
      else
        search_string = params[:search_string] 
        @search_string = search_string.gsub('%',' ')
        search_string.gsub!(' ','%')
        search_string = '%'+search_string+'%'
        if params[:sort] == 'popularity' 
          # for perfomance issues check: http://stackoverflow.com/questions/7005302/postgresql-how-to-make-not-case-sensitive-queries
          sql_search_in_subject = 'select * from topics where lower(subject) like lower(\''+search_string+'\') order by position ASC'
          sql_search_in_text = 'select * from topics where lower(text) like lower(\''+search_string+'\') order by position ASC'
          sql_search_in_comments = 'select * from topics where id in (select distinct topic_id from comments where lower(comment) like lower(\''+search_string+'\')) order by position ASC'
          sql_search_in_snippets = 'select * from topics where lower(snippet) like lower(\''+search_string+'\') order by created_at ASC'
          @topics = ActiveRecord::Base.connection.execute(sql_search_in_subject).to_a + ActiveRecord::Base.connection.execute(sql_search_in_snippets).to_a + ActiveRecord::Base.connection.execute(sql_search_in_text).to_a + ActiveRecord::Base.connection.execute(sql_search_in_comments).to_a
          @topics.uniq!
        else
          # for perfomance issues check: http://stackoverflow.com/questions/7005302/postgresql-how-to-make-not-case-sensitive-queries
          sql_search_in_subject = 'select * from topics where lower(subject) like lower(\''+search_string+'\') order by created_at DESC' 
          sql_search_in_text = 'select * from topics where lower(text) like lower(\''+search_string+'\') order by created_at DESC'
          sql_search_in_comments = 'select * from topics where id in (select distinct topic_id from comments where lower(comment) like lower(\''+search_string+'\')) order by created_at DESC'
          sql_search_in_snippets = 'select * from topics where lower(snippet) like lower(\''+search_string+'\') order by created_at DESC'
          @topics = ActiveRecord::Base.connection.execute(sql_search_in_subject).to_a + ActiveRecord::Base.connection.execute(sql_search_in_snippets).to_a + ActiveRecord::Base.connection.execute(sql_search_in_text).to_a + ActiveRecord::Base.connection.execute(sql_search_in_comments).to_a
          @topics.uniq!
        end
        @next=params[:next].to_i+1
      end
    end
  helper_method :list
  
  def chart
    @topics = Topic.order("topics.position DESC")
    @topics = @topics[0..10]
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
    @orig_from_comment = params[:orig_from_comment]
    @topic_id = params[:topic_id]
    new_user = User.create(params[:login],params[:password])
    if (new_user)
      if new_user.save
        session[:user_id] = new_user.id
        session[:login] = new_user.login      
        if params[:topic] != nil && (params[:comment] == '' || params[:comment] == nil)
          redirect_to(:action=>'create',:topic=>params[:topic],:notice=>'Thread added. User \''+new_user.login+'\' created succesfuly.')
          return
        end
        flash[:notice] = "User #{new_user.login} created."
        if params[:notice] == 'You need to be logged in to upvote.'
          if @orig_from_comment
            redirect_to(:controller=>'comments',:action=>'upvote_topic',:id=>@topic_id)
            return
          end
          if params[:topic_id] != nil
            redirect_to(:action=>:upvote,:id=>params[:topic_id])
            return
          else
            redirect_to(:action=>:upvote,:id=>params[:id])
            return
          end
        end        
        if params[:comment] != '' && params[:comment] != nil && params[:topic_id] != nil
          if !(params[:reply]) 
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
          if params[:comment] == nil || params[:comment] == ''
            redirect_to(:controller=>'comments',:action=>'index',:topic_id=>params[:topic_id])
            return
          end
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
    @topic_id = params[:topic_id]
    @orig_from_comment = params[:orig_from_comment]
    authorized_user = User.authenticate(params[:login],params[:password])
    if (authorized_user)
      session[:user_id] = authorized_user.id
      session[:login] = authorized_user.login
      if params[:topic] != nil 
        redirect_to(:action=>'create',:topic=>params[:topic])
        return
      end
      if params[:notice] == 'You need to be logged in to upvote.'
        if @orig_from_comment
          redirect_to(:controller=>'comments',:action=>'upvote_topic',:id=>@topic_id)
          return
        end
        if params[:topic_id] != nil
          redirect_to(:action=>:upvote,:id=>params[:topic_id])
          return
        else
          redirect_to(:action=>:upvote,:id=>params[:id])
          return
        end
      end
      flash[:notice] = "You are now logged in."
      if @topic_id == '' || @topic_id == nil 
        redirect_to(:action => 'list',:notice=>"You are now logged in as \'"+params[:login]+'\'.')
        return
      else
        if params[:reply] == 'false'
          redirect_to(:controller=>'comments',:action=>'index',:topic_id=>@topic_id)
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
    @orig_from_comment = params[:comment]
  end
  
  def logout
    session[:user_id] = nil
    session[:login] = nil
    redirect_to(:action=>'list',:notice=>"You have been logged out.")
  end
  
  def upvote
    if session[:user_id] == nil    
      redirect_to(:controller=>'topics',:action=>'login',:notice=>'You need to be logged in to upvote.', :topic_id=>params[:id],:orig_from_comment=>@orig_from_comment)
      return
    end
    if (params[:id] != nil)
      @topic = Topic.find(params[:id])
    else
      @topic = Topic.find(params[:topic_id])
    end
    if session[:user_id] == @topic.user_id
      redirect_to(:action=>'list',:notice=>'You can\'t upvote your own Posts.')
      return
    end
    @topic.position = ((@topic.points+1)/(Time.now - @topic.created_at))
    @topic.points = @topic.points+1
    @topic.upvoted_by = ' ' if @topic.upvoted_by == nil
    @topic.upvoted_by << session[:login].to_s+' '
    @topic.save
    User.upvote(@topic.user_id)    
    @topics = Topic.order("topics.position DESC") 
    if @orig_from_comment == true
      redirect_to(:controller=>'comments',:action=>'index',:id=>params[:id])
    else
      redirect_to(:action=>'list')
    end
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
      @comment = Comment.new(params[:comment])
      @topic.user_id = session[:user_id]
=begin
      @topic.text.gsub!('<p>','')
      @topic.text.gsub!('</p>','')
=end
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
      if @topic.url != '' && @topic.url != nil
        html_snippet = `python -m readability.readability -u #{@topic.url}` 
        @topic.snippet = Nokogiri::HTML(html_snippet).text.slice(0,600) + '...'
      else
        @topic.snippet = @topic.text.slice(0,600)
      end
      if @topic.save
        @topic.position = ((@topic.points+1)/(Time.now - @topic.created_at))
        @topic.points = @topic.points+1
        @topic.save       
        User.upvote(@topic.user_id)   
        redirect_to(:action=>'list',:sort=>'date',:notice=>params[:notice])
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
      redirect_to(:controller=>'topics',:action=>'create_acc_and_post_topic',:topic=>params[:topic])
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
  
  def get_header
    @user_id = @user_login = @user_karma = nil
    if session[:user_id] != nil
      @user_id = session[:user_id]
      user = User.find(@user_id)
      @user_login = user.login
      @user_karma = user.karma
    end
  end
  
end
