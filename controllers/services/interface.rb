require './controllers/core'
require './controllers/helpers/services_helper'
require './controllers/services/namespace/user'

class RestInterface < UserNamespace

  helpers ServicesHelpers

  before do
    content_type 'application/json'
  end

end