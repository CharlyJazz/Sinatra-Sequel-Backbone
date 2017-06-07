require './controllers/helpers/services_helper'
require './controllers/resources/user'

class API < Sinatra::Base
  include Endpoint

  helpers ServicesHelpers

  before do
    content_type 'application/json'
  end

  register Sinatra::UserResources

end