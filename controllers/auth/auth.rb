require 'jwt'
require 'openssl'
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
        headers = {
            exp: Time.now.to_i + 60*30 # Expire in 30 minutes
        }
        @token = JWT.encode({user_id: @user.id}, settings.signing_key, 'RS256', headers)
        session['access_token'] = @token
        if RoleUser.user_have_role? @user.id, 'admin' # Check user permission level
          level = 2
        else
          level = 1
        end
        { :response=>'User Logged successfully',
          :token=>@token,
          :id=>@user.id,
          :username=>@user.name,
          :email=>@user.email,
          :image_profile=>@user.image_profile,
          :permission_level=>level
        }.to_json
      else
        halt 403, {:response=>'Authentication failed'}.to_json
      end
    else
      halt 404, {:response=>'User no found'}.to_json
    end
  end

  post '/logout' do
    until session['access_token']
      halt 401, {:response=>'Not authorized'}.to_json
    end
    session['access_token'] = nil
    halt 200, {:response=>'User Logout successfully'}.to_json
  end

end