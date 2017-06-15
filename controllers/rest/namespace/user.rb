require './controllers/rest/namespace/snippet'

class UserNamespace < SnippetNamespace

  include RegexPattern

  helpers ServicesHelpers

  namespace '/user' do

    get '/' do
      # Read all users
      User.all.to_json
    end

    get '/:id' do
      # Read one user by id
      check_if_resource_exist(User, params['id']).to_json
    end

    post '/', :validate => [:name, :email, :password, :password_confirmation] do
      # Create user
      check_regex(Username, params['name'])
      check_regex(Email, params['email'])
      check_password_confirmation(params['password'], params['password_confirmation'])
      check_if_data_resource_exist(User, 'name', params['name'])
      check_if_data_resource_exist(User, 'email', params['email'])
      User.create(:name=>params['name'], :email=>params['email'],
                  :password=>params['password'], :password_confirmation=>params['password_confirmation']
      ).save().to_json
    end

    put '/:id', :validate => [:name, :email, :password, :password_confirmation] do
      # Update User
      user = User.for_update.first(:id=>params['id'])
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
        user.save.to_json
      end
    end

    patch '/:id/:attr' , :validate => [:value] do
      # Update one attribute of user
      user = User.for_update.first(:id=>params['id'])
      if user.equal?(nil)
        halt 404, {:response=>"Resource no found"}.to_json
      else
        eval("user." + params[:attr] + " = '#{params[:value]}'")
        user.save :validate=>false # Prevent exception for validation plugin
      end
      user.to_json
    end

    delete ':id' do
      # Delete user
      delete_record(User, params['id'].split(','))
    end

    patch '/:role/:id' do # esto era asi '/:role/user/:id cambiar specs
      # Update role of User
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

    get '/:id/follow' do
      # User count all follow
      user = check_if_resource_exist(User, params['id'])
      {:response=>RelationShip.where(:follower_id=>user.id).count}.to_json
    end

    get '/:id/followers' do
      # User count all followers
      user = check_if_resource_exist(User, params['id'])
      {:response=>RelationShip.where(:followed_id=>user.id).count}.to_json
    end

    post '/:follower_id/follow/:followed_id' do
      # User :followed_id follow user :follower_id
      followed = check_if_resource_exist(User, params['followed_id'])
      follower = check_if_resource_exist(User, params['follower_id'])
      RelationShip.follow_or_unfollow follower, followed
      {:response=>RelationShip.where(:followed_id=>followed.id).count}.to_json
    end

  end

end