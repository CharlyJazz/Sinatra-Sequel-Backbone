require './controllers/core'
require './controllers/helpers/slim_helpers'
require 'slim'

class WebsiteController < CoreController
  include SlimHelpers

  before do
    set_current_user
  end

  get '/' do
    slim :base
  end

end