require './controllers/core'
require './controllers/services/namespace/user'
require './helpers/services_helpers'
require './lib/middleware_jwt'

class RestInterface < UserNamespace

  helpers ServicesHelpers
  use AuthenticatorJWT

  before do
    content_type 'application/json'
    set_current_user false # Dont decode token
  end

  get '/validation' do
    # Check if data already use
    if params['username']
      if User.first(:name=>params['username'])
        halt 200, {:status=>'fail'}.to_json
      else
        halt 200, {:status=>'success'}.to_json
      end
    elsif params['email']
      if User.first(:email=>params['email'])
        halt 200, {:status=>'fail'}.to_json
      else
        halt 200, {:status=>'success'}.to_json
      end
    end
  end

end