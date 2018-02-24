require File.dirname(__FILE__) + '/../spec_helper'

describe User do
  context 'user resources' do
    before :each do
      @user = User.new(:name => 'SnippetMan', :email=>'SnippetMan@gmail.com',
                       :password=>'123456', :password_confirmation=>'123456').save
      Role.new(:name=>'user').save
    end
    context 'get all users' do
      it 'should response all user' do
        get '/api/user/'

        expect(JSON.parse(last_response.body)[0]['name']).to eq 'SnippetMan'
        expect(JSON.parse(last_response.body)[0]['password_digest']).to be_nil
        expect(last_response.status).to eq 200
      end
    end
    context 'get user by id' do
      it 'should response a user' do
        get '/api/user/1'

        expect(JSON.parse(last_response.body)['name']).to eq 'SnippetMan'
        expect(JSON.parse(last_response.body)['password_digest']).to be_nil
        expect(last_response.status).to eq 200
      end
      it 'should not found the resource' do
        get '/api/user/2'

        expect(JSON.parse(last_response.body)['response']).to eq 'Resource no found'
        expect(last_response.status).to eq 404
      end
    end
  end
end