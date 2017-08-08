require File.dirname(__FILE__) + '/../spec_helper'

describe 'Validation route, useful for ajax validation form' do
  before(:each) do
    @user = User.new(:name => 'SnippetMan', :email=>'SnippetMan@gmail.com',
                     :password=>'123456', :password_confirmation=>'123456').save
    @snippet = Snippet.new(:filename=>'file.js', :body=>'lorem', :user_id=>1).save
  end
  context 'Check if username already use' do
    it 'should return status fail' do
      get 'api/validation?username=SnippetMan'
      expect(JSON.parse(last_response.body)['status']).to eq 'fail'
      expect(last_response.status).to eq 200
    end
    it 'should return status success' do
      get 'api/validation?username=SnippetWomen'
      expect(JSON.parse(last_response.body)['status']).to eq 'success'
      expect(last_response.status).to eq 200
    end
  end
  context 'Check if email already use' do
    it 'should return status fail' do
      get 'api/validation?email=SnippetMan@gmail.com'
      expect(JSON.parse(last_response.body)['status']).to eq 'fail'
      expect(last_response.status).to eq 200
    end
    it 'should return status success' do
      get 'api/validation?email=SnippetWomen@gmail.com'
      expect(JSON.parse(last_response.body)['status']).to eq 'success'
      expect(last_response.status).to eq 200
    end
  end
end
