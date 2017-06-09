require File.dirname(__FILE__) + '/../spec_helper'

describe Snippet do
  before(:each) do
    @user = User.new(:name => "SnippetMan", :email=>"SnippetMan@gmail.com",
                     :password=>"123456", :password_confirmation=>"123456").save
    @snippet = Snippet.new(:filename=>"file.js", :body=>"lorem", :user_id=>1).save
  end
  context "get all snippet" do
    it "should return 200" do
      get "/api/snippet"

      expect(last_response.status).to eq 200
    end
  end
  context "get snippet by id" do
    it "should response a user" do
      get "/api/snippet/1"

      expect(JSON.parse(last_response.body)["filename"]).to eq "file.js"
      expect(last_response.status).to eq 200
    end
    it "should not found the resource" do
      get "/api/snippet/2"

      expect(JSON.parse(last_response.body)["response"]).to eq "Resource no found"
      expect(last_response.status).to eq 404
    end
  end
  context "create snippet" do

    let(:route) {"/api/snippet?filename=carlos.js&body=lorem&user_id=1"}

    it "should create 1 snippet" do

      1.times { post route }

      expect(last_response.status).to eq 200
      expect(Snippet.all.count).to eq 2
    end
    it "should create 2 snippets" do

      2.times { post route }

      expect(last_response.status).to eq 200
      expect(Snippet.all.count).to eq 3
    end
  end
  context "edit snippet" do

    let(:route_id_false) {"/api/snippet/2?filename=lorem.py&body=vendetta"}
    let(:route_id_true) {"/api/snippet/1?filename=lorem.py&body=vendetta"}
    let(:route_params_empty) {"/api/snippet/1?filename=&body="}

    it "Pass an id that does not exist " do
      put route_id_false

      expect(JSON.parse(last_response.body)["response"]).to eq "Resource no found"
      expect(last_response.status).to eq 404
    end
    it "Pass and body and title empty" do
      put route_params_empty

      expect(JSON.parse(last_response.body)["response"]).to eq "Any parameter are empty or nule"
      expect(last_response.status).to eq 404
    end
    it "Pass correct route" do
      put route_id_true

      expect(JSON.parse(last_response.body)["filename"]).to eq "lorem.py"
      expect(Snippet[1].filename).to eq "lorem.py"
      expect(last_response.status).to eq 200
    end
  end
  context "delete snippet by id" do
    it "should delete 1 snippet" do
      delete '/api/snippet/1'

      expect(JSON.parse(last_response.body)['response']).to eq("Resources deleted: 1")
      expect(last_response.status).to eq 200
      expect(Snippet.all.count).to eq 0
    end
  end
  context "delete snippet by id array" do
    before :each do
      3.times { |n|
        Snippet.new(:filename=>"file.js", :body=>"lorem", :user_id=>1).save
      }
    end
    it 'should delete 4 users' do
      delete '/api/snippet/1,2,3,4'

      expect(JSON.parse(last_response.body)['response']).to eq("Resources deleted: 4")
      expect(last_response.status).to eq 200
      expect(Snippet.all.count).to eq 0
    end
  end
  describe "Special resources" do
    context "get snippets by programming language" do

    end
    # TODO: add and remove like, response likes
  end
end