require 'test_helper'

class AdminControllerTest < ActionController::TestCase
  test "should get count_posts" do
    get :count_posts
    assert_response :success
  end

end
