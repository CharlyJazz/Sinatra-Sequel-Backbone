require File.dirname(__FILE__) + '/../spec_helper'

describe Proyect do
  before :each do
    # Create users
    @user = User.new(:name => 'SnippetMan',
                     :email=>'SnippetMan@gmail.com',
                     :password=>'123456',
                     :password_confirmation=>'123456').save
    @proyect = Proyect.new(:name=>'github',
                           :description=>'rails web for git repositories',
                           :user_id=>@user.id).save
  end
  context 'get all proyects' do
    it 'should get all proyects' do
      get '/api/proyect/'

      expect(last_response.status).to eq 200
    end
  end
  context 'get pagination with comments and likes counted' do
    before :each do
      @user_comment = User.new(:name => 'Audrey',
                               :email=>'Audrey@gmail.com',
                               :image_profile=>'img.png',
                               :password=>'123456',
                               :password_confirmation=>'123456').save
      @user_like = User.new(:name => 'Charly',
                            :email=>'Charly@gmail.com',
                            :image_profile=>'img.png',
                            :password=>'123456',
                            :password_confirmation=>'123456').save
    end
    it 'should the first proyect have 2 comments and 0 likes' do

      2.times {
        @user_comment.add_comment_proyect(:body=>'Sad', :proyect_id=>@proyect.id)
      }

      get '/api/proyect/?page=1'


      expect(JSON.parse(last_response.body)[0]['comment_count']).to eq 2
      expect(JSON.parse(last_response.body)[0]['like_count']).to eq 0
    end
    it 'should the first proyect have 3 comments and 2 likes' do
      @proyect_2 = Proyect.new(:name=>'github',
                               :description=>'rails web for git repositories',
                               :user_id=>@user.id).save

      3.times {
        @user_comment.add_comment_proyect(:body=>'Sad', :proyect_id=>@proyect_2.id)
      }

      2.times {
        @user_like.add_like_proyect(:proyect_id=>@proyect_2.id)
      }

      get '/api/proyect/?page=1'

      expect(JSON.parse(last_response.body)[1]['comment_count']).to eq 0
      expect(JSON.parse(last_response.body)[1]['like_count']).to eq 0
      expect(JSON.parse(last_response.body)[0]['comment_count']).to eq 3
      expect(JSON.parse(last_response.body)[0]['like_count']).to eq 2
    end
  end
  context 'get proyect by id' do
    it 'should get one proyect' do
      get '/api/proyect/1'

      expect(JSON.parse(last_response.body)['name']).to eq 'github'
      expect(last_response.status).to eq 200
    end
  end
end