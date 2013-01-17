class Topic < ActiveRecord::Base
  has_many :comments
  belongs_to :user

  serialize :upvoted_by

  scope :search, lambda {|query| where(["name LIKE ?", "%#{query}%"])}
end
