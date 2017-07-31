require './controllers/core'
require './controllers/helpers/services_helpers'
require './controllers/services/namespace/user'

class RestInterface < UserNamespace

  helpers ServicesHelpers

  before do
    content_type 'application/json'
    set_current_user
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