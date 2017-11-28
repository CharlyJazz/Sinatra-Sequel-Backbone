require 'jwt'
require 'openssl'
require './controllers/core'

class AuthController < CoreController

  before do
    content_type 'application/json'
    # set_current_user
  end

  post '/login', :validate => %i(email password) do
    @user = User.first(:email=>params[:email])
    if @user
      if @user.authenticate params[:password]
        { :response=>'User Logged successfully',
          :token=>JWT.encode({user_id: @user.id}, settings.signing_key, 'RS256', {exp: Time.now.to_i + 60 * 30}),
          :id=>@user.id,
          :username=>@user.name,
          :email=>@user.email,
          :image_profile=>@user.image_profile,
          :permission_level=> if RoleUser.user_have_role? @user.id, 'admin' then 2 else 1 end
        }.to_json
      else
        halt 403, {:response=>'Authentication failed'}.to_json
      end
    else
      halt 404, {:response=>'User no found'}.to_json
    end
  end

  post '/logout' do # TODO: FIXME
    halt 401, {:response=>'Not authorized'}.to_json unless @current_user.is_authenticated

    halt 200, {:response=>'User Logout successfully'}.to_json
  end

  post '/recovery' do # TODO: FIXME
    halt 401, {:response=>'Not authorized'}.to_json if @current_user.expired

    { :id=>@current_user.id,
      :username=>@current_user.username,
      :email=>@current_user.email,
      :image_profile=>@current_user.picture,
      :permission_level=>@current_user.permission_level
    }.to_json
  end

end