require './controllers/core'
require './controllers/helpers/services_helpers'
require './controllers/services/namespace/user'

class RestInterface < UserNamespace

  helpers ServicesHelpers

  before do
    content_type 'application/json'
    set_current_user
  end

end