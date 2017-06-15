require './controllers/core'
require './controllers/helpers/services_helper'
require './controllers/rest/namespace/user'

class RestInterface < UserNamespace

  helpers ServicesHelpers

  before do
    content_type 'application/json'
  end

  get '/' do
    'Sinatra + Backbone + Sequel, API Version 0.0.1'.to_json
  end

end