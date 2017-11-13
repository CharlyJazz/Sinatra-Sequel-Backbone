require './controllers/core'
require './controllers/helpers/website_helpers'
require './controllers/helpers/services_helpers'

class WebsiteController < CoreController

  helpers WebsiteHelpers

  before do
    set_current_user
  end

  get '/' do
    @pdf = false

    erb :index
  end

  get '/pdf/:id' do
    @pdf = true

    @snippet = Snippet[params[:id]]

    halt 404, {:response=>'Resource no found'}.to_json if @snippet.nil?

    @language = Snippet.detect_lang @snippet
    
    erb :editor
  end
end