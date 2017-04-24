require File.dirname(__FILE__) + '/../spec_helper'

describe LikeSnippet do
  before :each do
    @user_have_snippet = User.new(:name => "SnippetMan", :email=>"SnippetMan@gmail.com", :password=>"123456", :password_confirmation=>"123456").save 
    @user_like_1 = User.new(:name => "Audrey", :email=>"Audrey@gmail.com", :password=>"123456", :password_confirmation=>"123456").save
    @user_like_2 = User.new(:name => "Alex", :email=>"Alex@gmail.com", :password=>"123456", :password_confirmation=>"123456").save
    @snippet = Snippet.new(:filename => "backbone.js", :body=>"Lorem ipsum...", :user_id=>@user_have_snippet.id).save
  end
  describe "should be the literal table name" do
    it "should return true" do
      expect(LikeSnippet.simple_table).to eq("`like_snippets`")
    end
  end
  # describe "create like" do
  #   it "should create like" do

  #   end
  # end
  # describe "remove like" do
  #   it "should remove like" do
      
  #   end    
  # end
  # describe "create several likes" do
  #   it "should be two likes" do
      
  #   end    
  # end
end