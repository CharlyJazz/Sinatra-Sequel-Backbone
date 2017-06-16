require File.dirname(__FILE__) + '/../spec_helper'

describe Proyect do
  before :each do
    # Create users
    @user = User.new(:name => "SnippetMan", :email=>"SnippetMan@gmail.com",
                     :password=>"123456", :password_confirmation=>"123456").save
    @proyect = Proyect.new(:name=>"github", :description=>"rails web for git repositories",
                           :user_id=>@user.id).save
  end
  after :each do
    puts last_response.body
    puts "- - - - - - "
  end
  context "get all proyects" do
    it "should get all proyects" do
      get "/api/proyect"

      expect(last_response.status).to eq 200
    end
  end
  context "get proyect by id" do
    it "should get one proyect" do
      get "/api/proyect/1"

      expect(JSON.parse(last_response.body)["name"]).to eq "github"
      expect(last_response.status).to eq 200
    end
  end
  context "create proyect" do

    let(:route_true) {"/api/proyect?name=proyect_name&description=description_proyect&user_id=1"}
    let(:route_parameter_empty) {"/api/proyect?name=proyect_name&description=&user_id="}
    let(:route_without_parameter) {"/api/proyect"}

    it "should create proyect" do
      post route_true

      expect(Proyect[2].name).to eq "proyect_name"
    end

    it "should no create proyect" do
      post route_parameter_empty

      expect(JSON.parse(last_response.body)["response"]).to eq "Any parameter are empty or nule"
      expect(last_response.status).to eq 404
    end

    it "should no create proyect" do
      post route_without_parameter

      expect(JSON.parse(last_response.body)["response"]).to eq "Any parameter are empty or nule"
      expect(last_response.status).to eq 404
    end
  end
  context "edit proyects" do
    it "should edit proyect" do
      put "/api/proyect/1?name=proyect_name_new&description=description_proyect_new&user_id=1"

      expect(JSON.parse(last_response.body)["name"]).to eq "proyect_name_new"
      expect(JSON.parse(last_response.body)["description"]).to eq "description_proyect_new"
      expect(Proyect[1].name).to eq "proyect_name_new"
    end
  end
  context "delete proyects by id" do
    it 'should delete proyect' do
      delete "/api/proyect/1"

      expect(JSON.parse(last_response.body)["response"]).to eq "Resources deleted: 1"
      expect(Proyect[1]).to be_kind_of NilClass
    end

  end
  context "delete proyects by id array" do
    before :each do
      3.times {Proyect.new(:name=>"github",
                           :description=>"rails web for git repositories",
                           :user_id=>@user.id).save}
    end
    it 'should delete 4 proyects' do
      delete '/api/proyect/1,2,3,4'

      expect(JSON.parse(last_response.body)['response']).to eq("Resources deleted: 4")
      expect(last_response.status).to eq 200
      expect(Proyect.all.count).to eq 0
    end
  end
  describe "Snippet functionality" do
    context "add and remove snippet to proyect" do
      before(:each) do
        @snippet_1 = Snippet.new(:filename => "filename1.js", :body=>"Lorem ipsum...", :user_id=>@user.id).save
        @snippet_2 = Snippet.new(:filename => "filename2.js", :body=>"Lorem ipsum...", :user_id=>@user.id).save
        @snippet_3 = Snippet.new(:filename => "filename3.js", :body=>"Lorem ipsum...", :user_id=>@user.id).save

        Proyect.add_snippets(@proyect, [@snippet_1, @snippet_2, @snippet_3])
      end
      context "Pass route with id true" do
        it "should have 3 snippets" do
          get '/api/proyect/1/snippet'

          expect(JSON.parse(last_response.body).count).to eq 3
        end
      end
      context "Pass route with id false" do
        it "should return 404" do
          get '/api/proyect/2/snippet'

          expect(JSON.parse(last_response.body).length).to_not eq 3
          expect(last_response.status).to eq 404
        end
      end
      context "remove snippet" do
        it "should remove snippet" do
          delete '/api/proyect/1/snippet/1'

          expect(JSON.parse(last_response.body)["response"]).to eq "Resources deleted: 1"
        end
        it "should remove 3" do
          delete '/api/proyect12/snippet/1,2,3'

          expect(JSON.parse(last_response.body)["response"]).to eq "Resources deleted: 3"
        end
        context "delete snippet that does not exist"
          it "should " do
            delete '/api/proyect12/snippet/4'
            # TODO: Esto hay que programarlo bien, porque hay que eliminar la relacion de ProyectHasSnippet
            # con el snippet y el proyecto,  y en caso de lanzar un id de snippet que no esta relacionado no
            # se podria quitar ninguna relacion porque no hay

            expect(JSON.parse(last_response.body)["response"]).to eq "Resource no found"
          end
        end
      context "add snippet" do
        it "should add snippet" do
          post '/api/proyect/1/snippet/4'

          expect(JSON.parse(last_response.body)["response"]).to eq "Resources deleted: 1"
        end
        context "add several snippets" do
          it "should add 3 more" do
            post '/api/proyect/1/snippet/4,5,6'

            expect(JSON.parse(last_response.body)["response"]).to eq "Resources deleted: 3"
          end
        end
        context "add snippet already added in the proyect" do
          it "should return message" do
            post '/api/proyect/1/snippet/1'

            expect(JSON.parse(last_response.body)["response"]).to eq "This snippet is already added to the project"
          end
        end
        context "Add snippet that does not exist" do
          it "should no found" do
            post '/api/proyect/1/snippet/10'

            expect(JSON.parse(last_response.body)["response"]).to eq "Resource no found"
          end
        end
      end
    end
  end
  describe "Comment proyect" do
    before :each do
      @user_comment = User.new(:name => "SuperMan", :email=>"SuperMan@gmail.com",
                               :password=>"123456", :password_confirmation=>"123456").save
    end
    context "read comment" do
      it "should get all comment of proyect" do

        3.times {@user_comment.add_comment_proyect(:body=>"Sad", :proyect_id=>@proyect.id)}

        get '/api/proyect/1/comment'

        expect(JSON.parse(last_response.body).count).to eq 3
        expect(last_response.status).to eq 200
      end
    end
    context "create comment" do
      it "should create comment" do
        post '/api/proyect/1/comment?body=new_comment&user_id=2'

        expect(Proyect[1].comment_proyects.count).to eq 1
        expect(JSON.parse(last_response.body)["body"]).to eq "new_comment"
        expect(last_response.status).to eq 200
      end
    end
    context "edit comment" do
      it "should edit comment" do
        @user_comment.add_comment_proyect(:body=>"Sad", :proyect_id=>@proyect.id)

        put '/api/proyect/1/comment/1?body=edit_comment'

        expect(Proyect[1].comment_proyects[0].body).to eq "edit_comment"
      end
    end
    context "delete comments" do
      it "should delete 3 comments" do
        3.times {@user_comment.add_comment_proyect(:body=>"Sad", :proyect_id=>@proyect.id)}

        delete '/api/proyect/1/comment/1,2,3'

        expect(Proyect[1].comment_proyects.count).to eq 0
        expect(CommentProyect.all.count).to eq 0
        expect(JSON.parse(last_response.body)['response']).to eq("Resources deleted: 3")
      end
    end
  end
end