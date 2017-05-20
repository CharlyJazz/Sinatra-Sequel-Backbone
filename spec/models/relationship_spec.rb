require File.dirname(__FILE__) + '/../spec_helper'

describe RelationShip do
  before :each do
    @user_1 = User.new(:name => "Audrey", :email=>"Audrey@gmail.com", :password=>"123456", :password_confirmation=>"123456").save
    @user_2 = User.new(:name => "Alex", :email=>"Alex@gmail.com", :password=>"123456", :password_confirmation=>"123456").save
  end
  context "should be the literal table name" do
    it "expect return true" do
      expect(RelationShip.simple_table).to eq("`relationships`")
    end
  end
  context "user following other user" do
    before :each do
      RelationShip.create(:followed_id=>@user_1.id, :follower_id=>@user_2.id)
    end
    it 'should create follower record' do
      expect(RelationShip.where(:followed_id=>@user_1.id).count).to eq(1)
    end
  end
  context "relationship special method" do
    before :each do
      RelationShip.create(:followed_id=>@user_1.id, :follower_id=>@user_2.id)
    end
    it 'should return true' do
      expect(RelationShip.following? @user_2, @user_1).to eq(true)
    end
    it "should unfollow" do
      RelationShip.follow_or_unfollow(@user_2, @user_1)
      expect(RelationShip.following? @user_2, @user_1).to eq(false)      
    end
  end  
end