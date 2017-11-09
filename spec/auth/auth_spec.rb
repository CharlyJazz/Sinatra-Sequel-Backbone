require File.dirname(__FILE__) + '/../spec_helper'
require 'jwt'

verify_key = ''

verify_key_path = File.expand_path('../../../app.rsa.pub', __FILE__)

File.open(verify_key_path) do |file|
  verify_key = OpenSSL::PKey.read(file)
end

describe 'Login, Logout and Recovery' do
  before :each do
    @user = User.new(:name => 'SnippetMan',
                     :email=>'SnippetMan@gmail.com',
                     :password=>'123456',
                     :image_profile=> 'file.png',
                     :password_confirmation=>'123456').save
  end
  context 'Trying to user without password parameter' do
    it "should return 'Any parameter are empty or nule' " do
      post '/auth/login?email=SnippetMan@gmail.com'

      expect(JSON.parse(last_response.body)['response']).to eq 'Any parameter are empty or null'
      expect(last_response.status).to eq 422
    end
  end
  context 'Trying to log in as non-existing user' do
    it "should return 'User no found' " do
      post '/auth/login?email=carl3os@gmail.com&password=123456'

      expect(JSON.parse(last_response.body)['response']).to eq 'User no found'
      expect(last_response.status).to eq 404
    end
  end
  context 'Trying to log user with incorrect password' do
    it "should return 'Authentication failed' " do
      post '/auth/login?email=SnippetMan@gmail.com&password=12345'

      expect(JSON.parse(last_response.body)['response']).to eq 'Authentication failed'
      expect(last_response.status).to eq 403
    end
  end
  context 'Trying to log user correctly' do
    before :each do
      %w[admin user].each { |role| Role.new(:name=>role).save }
      @user.add_role Role.first(:name=>'user')
    end
    it "should return 'User Logged successfully'" do
      post '/auth/login?email=SnippetMan@gmail.com&password=123456'

      expect(JSON.parse(last_response.body)['response']).to eq 'User Logged successfully'
      expect(last_response.status).to eq 200

      token = JSON.parse(last_response.body)['token']
      payload, header = JWT.decode(token, verify_key, true, {:algorithm => 'RS256'})

      expect(header['exp']).to eq Time.now.to_i + 60 * 30
      expect(header['alg']).to eq 'RS256'
      expect(payload['user_id']).to eq 1
    end
  end
  context 'Trying to logout user without before login' do
    it "should return 'Not authorized'" do
      post '/auth/logout'

      expect(JSON.parse(last_response.body)['response']).to eq 'Not authorized'
      expect(last_response.status).to eq 401
    end
  end
  context 'Trying to logout user correctly' do
    before :each do
      %w[admin user].each { |role| Role.new(:name=>role).save }
      @user.add_role Role.first(:name=>'user')
    end
    it "should return 'User Logout successfully'" do
      post '/auth/login?email=SnippetMan@gmail.com&password=123456'
      token = JSON.parse(last_response.body)['token']
      header 'Authorization', 'Bearer ' + token       

      post '/auth/logout'
      
      expect(JSON.parse(last_response.body)['response']).to eq 'User Logout successfully'
      expect(last_response.status).to eq 200
    end
  end
  context 'Recovery user information' do
    before :each do
      %w[admin user].each { |role| Role.new(:name=>role).save }
      @user.add_role Role.first(:name=>'user')
    end
    it 'should return user information' do
      post '/auth/login?email=SnippetMan@gmail.com&password=123456'
      token = JSON.parse(last_response.body)['token']
      header 'Authorization', 'Bearer ' + token    

      post '/auth/recovery'
  
      expect(JSON.parse(last_response.body)['id']).to eq @user.id
      expect(JSON.parse(last_response.body)['username']).to eq @user.name
      expect(JSON.parse(last_response.body)['email']).to eq @user.email
      expect(last_response.status).to eq 200
    end
  end
end

