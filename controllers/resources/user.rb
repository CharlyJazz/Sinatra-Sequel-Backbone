module Sinatra
  module UserResources

    include RegexPattern

    def self.registered(app)

      app.get '/user/' do
        # All users
        User.all.to_json
      end

      app.get '/user/:id' do
        # Read User
        user = check_if_resource_exist(User, params['id'])
        user.to_json
      end

      app.post '/user/' do
        # Create User
        check_regex(Username, params['name'])
        check_regex(Email, params['email'])
        check_password_confirmation(params['password'], params['password_confirmation'])
        check_if_data_resource_exist(User, 'name', params['name'])
        check_if_data_resource_exist(User, 'email', params['email'])
        user = User.create(:name=>params['name'],
                           :email=>params['email'],
                           :password=>params['password'],
                           :password_confirmation=>params['password_confirmation']).save()
        user.to_json
      end

      app.put '/user/:id/' do
        # Update User
        user =  User.for_update.first(:id=>params['id'])
        if user.equal?(nil)
          halt 404, {:response=>"Resource no found"}.to_json
        else
          check_regex(Username, params['name'])
          check_regex(Email, params['email'])
          check_password_confirmation(params['password'], params['password_confirmation'])
          check_if_data_resource_exist(User, 'name', params['name'], params[:id])
          check_if_data_resource_exist(User, 'email', params['email'], params[:id])
          user.name = params['name']
          user.email = params['email']
          user.password = params['password']
          user.password_confirmation = params['password_confirmation']
          user.save
          user.to_json
        end
      end

      app.patch '/user/:id/:attr' do
        # User update one attribute
        user = User.for_update.first(:id=>params['id'])
        if user.equal?(nil)
          halt 404, {:response=>"Resource no found"}.to_json
        else
          # TODO: protect this eval
          eval("user." + params[:attr] + " = '#{params[:value]}'")
          user.save :validate=>false # Prevent exception for validation plugin
        end
        user.to_json
      end

      app.delete '/user/:id' do
        # Delete User
        c = 0
        params['id'].split(',').each { |n|
          user = check_if_resource_exist(User, n)
          user.delete
          c += 1
        }
        {:response=>"Resources deleted: #{c}"}.to_json
      end

      app.patch '/role/:role/user/:id' do
        # Change role of User
        user = User.first(:id=>params['id'])
        if user.equal?(nil)
          halt 404, {:response=>"Resource no found"}.to_json
        else
          if Role.role_exist? params[:role]
            # Check si el usuario tiene ese rol con el methodo de user_have_role?
            if RoleUser.user_have_role? params[:id], Role.first(:name=>params[:role]).id
            # Si el usuario tiene el rol retornamos un mensaje diciendoloe
              halt 404, {:response=>"Action not allowed, this user already has this role"}.to_json
            else
            # Si el usuario no tiene ese rol se lo asignamos
            # y retornamos un mensaje diciendolo, pero eliminamos su rol anterior
              if params[:role].equal? "admin"
                Role.remove_role_from_user user, Role.first(:name=>"user")
                Role.add_role_to_user user, Role.first(:name=>"admin")
              elsif params[:role].equal? "user"
                Role.remove_role_from_user user, Role.first(:name=>"admin")
                Role.add_role_to_user user, Role.first(:name=>"user")
              end
              {:response=>"Added role successfully"}.to_json
            end
          else
            # Si el rol no existe
            halt 404, {:response=>"Action not allowed, role does not exist"}.to_json
          end
        end
      end
    end
  end

  register UserResources

end