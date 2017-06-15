require './controllers/core'

class WebsiteController < CoreController
  # TODO: crear app web
  get '/' do
    'Hello Website'
  end

end