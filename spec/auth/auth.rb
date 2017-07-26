require File.dirname(__FILE__) + '/../spec_helper'

describe 'Login and Logout' do
  before :each do
    @user = User.new(:name => "SnippetMan", :email=>"SnippetMan@gmail.com",
                     :password=>"123456", :password_confirmation=>"123456").save
  end
  context "Trying to user without password parameter" do
    it "should return 'User Logged successfully' " do
      post "/auth/login?email=SnippetMan@gmail.com"

      expect(JSON.parse(last_response.body)["response"]).to eq "Any parameter are empty or nule"
      expect(last_response.status).to eq 422
    end
  end
  context "Trying to log in as non-existing user" do
    it "should return 'User no found' " do
      post "/auth/login?email=carl3os@gmail.com&password=123456"

      expect(JSON.parse(last_response.body)["response"]).to eq "User no found"
      expect(last_response.status).to eq 404
    end
  end
  context "Trying to log user with incorrect password" do
    it "should return 'Authentication failed' " do
      post "/auth/login?email=SnippetMan@gmail.com&password=12345"

      expect(JSON.parse(last_response.body)["response"]).to eq "Authentication failed"
      expect(last_response.status).to eq 403
    end
  end
  context "Trying to log user correctly" do
    it "should return 'User Logged successfully' " do
      post "/auth/login?email=SnippetMan@gmail.com&password=123456"

      expect(JSON.parse(last_response.body)["response"]).to eq "User Logged successfully"
      expect(last_response.status).to eq 200
    end
  end
  context "Trying to logout user without before login" do
    it "should return 'Not authorized' " do
      post "/auth/logout"

      expect(JSON.parse(last_response.body)["response"]).to eq "Not authorized"
      expect(last_response.status).to eq 401
    end
  end
  context "Trying to logout user correctly" do
    before :each do
      post "/auth/login?email=SnippetMan@gmail.com&password=123456"
    end
    it "should return 'User Logout successfully' " do
      post "/auth/logout"

      expect(JSON.parse(last_response.body)["response"]).to eq "User Logout successfully"
      expect(last_response.status).to eq 200
    end
  end
end

