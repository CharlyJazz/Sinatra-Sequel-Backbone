require './controllers/core'

class AuthController < CoreController

  before do
    content_type 'application/json'
    set_current_user
  end

  post '/login', :validate => [:email, :password] do
    @user = User.first(:email=>params[:email])
    if @user
      if @user.authenticate params[:password]
        session[:user] = @user.id
        {:response=>"User Logged successfully"}.to_json
      else
        halt 403, {:response=>"Authentication failed"}.to_json
      end
    else
      halt 404, {:response=>"User no found"}.to_json
    end
  end

  post '/logout' do
    until session[:user]
      halt 401, {:response=>"Not authorized"}.to_json
    end
    halt 200, {:response=>"User Logout successfully"}.to_json
  end

end