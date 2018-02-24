require File.dirname(__FILE__) + '/../spec_helper'

describe Tag do
  context 'Read Tags' do
    before :each do
      %w[javascript python c haskell c# cpp coffeescript].each { |n|
        Tag.create(:name=>n, :description=>'language').save
      }
    end
    it 'should return all tags without filter' do
      get '/api/tag/?$count=true'

      expect(JSON.parse(last_response.body)['response']).to eq 7
    end
    it 'should return 4 tags' do
      get '/api/tag/?$filter=true&name=script&$count=true'

      expect(JSON.parse(last_response.body)['response']).to eq 2
    end
    it 'should return 4 tags' do
      get '/api/tag/?$filter=true&name=c&$limit=4'

      expect(JSON.parse(last_response.body).count).to eq 4
    end
    it 'should all without nothing' do
      get '/api/tag/'

      expect(JSON.parse(last_response.body).count).to eq 7
    end
    it 'should return javascript tag' do
      get '/api/tag/1'

      expect(JSON.parse(last_response.body)['name']).to eq 'javascript'
    end
  end
end