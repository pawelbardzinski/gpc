require 'digest/sha1'

class User < ActiveRecord::Base
  has_many :topics
  has_many :comments
  
  validates_length_of :password, :within => 4..25, :allow_blank=>true
  validates_length_of :login, :within => 4..25
  validates_uniqueness_of :login
    
  attr_accessor :password
  before_save :create_hashed_password
  after_save :clear_password
  attr_protected :hashed_password, :salt
  
  def self.upvote(id="")
    user = User.find(id)
    user.karma = user.karma + 1
    user.save
  end

  def self.make_salt(login="")
    Digest::SHA1.hexdigest("Use #{login} with #{Time.now} to make salt.")
  end

  def self.hash_with_salt(password="", salt="")
    Digest::SHA1.hexdigest("Put #{salt} on the #{password}")
  end
  
  def self.authenticate(login="",password="")
    user = User.find_by_login(login)
    if user && user.password_match?(password)
      return user
    else
      return false
    end
  end
  
  def self.create(login="",password="")
    user = User.new(:login=>login,:password=>password)
  end
  
  def password_match?(password="")
    hashed_password == User.hash_with_salt(password,salt)
  end
  
  private
  
  def create_hashed_password
    unless password.blank?
      self.salt=User.make_salt(login) if salt.blank?
      self.hashed_password=User.hash_with_salt(password,salt)
    end
  end
  
  def clear_password
    self.password = nil
  end
  
end

