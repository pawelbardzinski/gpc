class Comment < ActiveRecord::Base
  belongs_to :user
  belongs_to :topic
  
  validates_length_of :comment, :minimum=>2
end
