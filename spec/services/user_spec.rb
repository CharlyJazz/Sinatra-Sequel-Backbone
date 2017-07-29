require File.dirname(__FILE__) + '/../spec_helper'

describe User do
  context "user resources" do
    before :each do
      @user = User.new(:name => "SnippetMan", :email=>"SnippetMan@gmail.com",
                       :password=>"123456", :password_confirmation=>"123456").save
    end
    context "get all users" do
      it "should response all user" do
        get "/api/user/"

        expect(JSON.parse(last_response.body)[0]["name"]).to eq "SnippetMan"
        expect(JSON.parse(last_response.body)[0]["password_digest"]).to be_nil
        expect(last_response.status).to eq 200
      end
    end
    context "get user by id" do
      it "should response a user" do
        get "/api/user/1"

        expect(JSON.parse(last_response.body)["name"]).to eq "SnippetMan"
        expect(JSON.parse(last_response.body)["password_digest"]).to be_nil
        expect(last_response.status).to eq 200
      end
      it "should not found the resource" do
        get "/api/user/2"

        expect(JSON.parse(last_response.body)["response"]).to eq "Resource no found"
        expect(last_response.status).to eq 404
      end
    end
    context "create user" do

      let(:route) {"/api/user/?name=carl3os&password=1232dsa&password_confirmation=1232dsa&email=carl3os@gmail.com"}

      it "should create a user" do
        1.times { post route }

        expect(JSON.parse(last_response.body)["name"]).to eq "carl3os"
        expect(JSON.parse(last_response.body)["password_digest"]).to be_nil
        expect(last_response.status).to eq 200
        expect(User.all().count).to eq 2
      end
      it "should create one user and response 404" do
        2.times { post route }

        expect(last_response.status).to eq 404
        expect(User.all().count).to eq 2
      end
    end
    context "edit user" do
      let(:route_id_false) {"/api/user/2?name=SnippetMan&password=snippet123123&password_confirmation=snippet123123&email=SnippetMan@gmail.com"}
      let(:route_id_true) {"/api/user/1?name=carl3os&password=1232dsa&password_confirmation=1232dsa&email=carl3os@gmail.com"}
      let(:route_edit_password) {"/api/user/1?name="+@user.name+"&password=1232dsa&password_confirmation=1232dsa&email="+@user.email}
      it "Pass an id that does not exist" do
        put route_id_false

        expect(JSON.parse(last_response.body)["response"]).to eq "Resource no found"
        expect(last_response.status).to eq 404
      end
      it "Pass an id that exist and edit all attributes" do
        put route_id_true

        expect(User.first(:id=>1).name).to eq "carl3os"
        expect(last_response.status).to eq 200
      end
      it "Pass path to edit only the key" do
        put route_edit_password

        expect(JSON.parse(last_response.body)['response']).to_not eq("There is already a resource with this data")
        expect(last_response.status).to eq 200
        expect(JSON.parse(last_response.body)["name"]).to eq "SnippetMan"
        expect(JSON.parse(last_response.body)["password_digest"]).to be_nil
        expect(User.first(:id=>1).name).to eq "SnippetMan" # Should no affected
        expect(User.first(:id=>1).email).to eq "SnippetMan@gmail.com" # Should no affected
      end

      it "should edit the name" do
        patch '/api/user/1/name?value=new_name'

        expect(last_response.status).to eq 200
        expect(User.first(:id=>1).name).to eq "new_name"
      end
    end
    context "delete user by id" do
      it "should delete user" do
        delete '/api/user/1'

        expect(JSON.parse(last_response.body)['response']).to eq("Resources deleted: 1")
        expect(last_response.status).to eq 200
        expect(User.all.count).to eq 0
      end
    end
    context "delete users by id array" do
      before :each do
        3.times { |n|
          User.new(:name=>n.to_s+"abcdef", :email=>n.to_s+"abcdf@gmail.com",
                   :password=>n.to_s+"123456", :password_confirmation=>n.to_s+"123456").save
        }
      end
      it 'should delete 4 users' do
        delete '/api/user/1,2,3,4'

        expect(JSON.parse(last_response.body)['response']).to eq("Resources deleted: 4")
        expect(last_response.status).to eq 200
        expect(User.all.count).to eq 0
      end
    end
    describe "Role functionality" do
      before :each do
        @admin = User.new(:name => "admin_user", :email=>"admin@gmail.com",
                         :password=>"123456", :password_confirmation=>"123456").save
        @role = Role.new(:name=>"admin").save
        Role.add_role_to_user(@role, @admin)
      end
      context "add role to user that does no exist" do
        it "should return 404 and message" do
          patch '/api/user/123/role/admin'

          expect(JSON.parse(last_response.body)['response']).to eq("Resource no found")
          expect(last_response.status).to eq 404
        end
      end
      context "add admin role to use" do
        it "should add admin role to user" do
          # Add admin role to SnippetMan user
          patch '/api/user/1/role/admin'

          expect(JSON.parse(last_response.body)['response']).to eq("Added role successfully")
          expect(last_response.status).to eq 200
        end
      end
      context "add admin role to user already admin" do
        it "should return 404 and message" do
          # Try add admin role to user already admin
          patch '/api/user/2/role/admin'

          expect(JSON.parse(last_response.body)['response']).to eq("Action not allowed, this user already has this role")
          expect(last_response.status).to eq 404
        end
      end
      context "try adding a role that does not exist" do
        it "should return 404 and message" do
          patch '/api/user/2/role/apple'

          expect(JSON.parse(last_response.body)['response']).to eq("Action not allowed, role does not exist")
          expect(last_response.status).to eq 404
        end
      end
    end
    describe "followers functionality" do
      before :each do
        3.times { |n|
          User.new(:name=>n.to_s+"abcdef", :email=>n.to_s+"abcdf@gmail.com",
                   :password=>n.to_s+"123456", :password_confirmation=>n.to_s+"123456").save
        }
      end
      it "should follow and unfollow" do
        post '/api/user/2/follow/1'

        expect(JSON.parse(last_response.body)['response']).to eq 1

        post '/api/user/2/follow/1'

        expect(JSON.parse(last_response.body)['response']).to eq 0
      end
      it "should followers 3" do
        post '/api/user/1/follow/4'
        post '/api/user/2/follow/4'
        post '/api/user/3/follow/4'

        expect(JSON.parse(last_response.body)['response']).to eq 3
      end
      context "users following you" do
        it "should response 3 users" do
          post '/api/user/2/follow/1'
          post '/api/user/3/follow/1'
          post '/api/user/4/follow/1'

          get '/api/user/1/followers'

          expect(JSON.parse(last_response.body)['response']).to eq 3
        end
      end
      context "users you follow" do
        it "should return 3 users" do
          post '/api/user/1/follow/2'
          post '/api/user/1/follow/4'
          post '/api/user/1/follow/3'

          get '/api/user/1/follow'

          expect(JSON.parse(last_response.body)['response']).to eq 3
        end
      end
    end
  end
end