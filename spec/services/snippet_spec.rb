require File.dirname(__FILE__) + '/../spec_helper'

describe Snippet do
  before(:each) do
    @user = User.new(:name => 'SnippetMan',
                     :email=>'SnippetMan@gmail.com',
                     :password=>'123456',
                     :password_confirmation=>'123456').save
    @snippet = Snippet.new(:filename=>'file.js',
                           :body=>'lorem',
                           :user_id=>1).save
  end
  context 'get all snippet' do
    it 'should return 200' do
      get '/api/snippet/'

      expect(last_response.status).to eq 200
    end
  end
  context 'get pagination of snippets' do
    it 'should return 200' do
      get '/api/snippet/?page=1'

      expect(last_response.status).to eq 200
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
      it 'should the first snippet have 2 comments and 0 likes' do

        2.times {
          @user_comment.add_comment_snippet(:title=>'The sad code',
                                            :body=>'Sad', :line_code=>2,
                                            :snippet_id=>@snippet.id)
        }

        get '/api/snippet/?page=1'


        expect(JSON.parse(last_response.body)[0]['comment_count']).to eq 2
        expect(JSON.parse(last_response.body)[0]['like_count']).to eq 0
      end
      it 'should the first snippet have 3 comments and 2 likes' do

        @snippet_2 = Snippet.new(:filename=>'file.js',
                               :body=>'lorem',
                               :user_id=>1).save

        3.times {
          @user_comment.add_comment_snippet(:title=>'The sad code',
                                            :body=>'Sad', :line_code=>2,
                                            :snippet_id=>@snippet_2.id)
        }

        2.times {
          @user_like.add_like_snippet(:snippet_id=>@snippet_2.id)
        }

        get '/api/snippet/?page=1'

        expect(JSON.parse(last_response.body)[1]['comment_count']).to eq 0
        expect(JSON.parse(last_response.body)[1]['like_count']).to eq 0
        expect(JSON.parse(last_response.body)[0]['comment_count']).to eq 3
        expect(JSON.parse(last_response.body)[0]['like_count']).to eq 2
      end
    end
  end
  context 'get snippet by id' do
    it 'should response a user' do
      get '/api/snippet/1'

      expect(JSON.parse(last_response.body)['filename']).to eq 'file.js'
      expect(last_response.status).to eq 200
    end
    it 'should not found the resource' do
      get '/api/snippet/2'

      expect(JSON.parse(last_response.body)['response']).to eq 'Resource no found'
      expect(last_response.status).to eq 404
    end
  end
end