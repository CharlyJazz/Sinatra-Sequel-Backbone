require './controllers/core'
require './controllers/helpers/website_helpers'

class WebsiteController < CoreController

  helpers WebsiteHelpers

  before do
    set_current_user
  end

  get '/' do
    erb :index
  end

end