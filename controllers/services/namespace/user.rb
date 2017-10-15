require './controllers/services/namespace/snippet'

class UserNamespace < SnippetNamespace

  include RegexPattern

  helpers ServicesHelpers

  namespace '/user' do

    get '/' do
      # Read all users
      # Prevent send the password
      users = User.all
      users.map { |user|
        user.json_serializer_opts(:except=>:password_digest)
      }
      users.to_json
    end

    get '/:id' do
      # Read one user by id
      check_if_resource_exist(User, params[:id])
      User.serialize params[:id]
    end

    post '/', :validate => %i(name email password password_confirmation image_profile) do
      # Create user
      check_regex(Username, params[:name])
      check_regex(Email, params[:email])
      check_password_confirmation(params[:password], params[:password_confirmation])
      check_if_data_resource_exist(User, 'name', params[:name])
      check_if_data_resource_exist(User, 'email', params[:email])
      user = User.create(:name=>params[:name],
                         :email=>params[:email],
                         :password=>params[:password],
                         :password_confirmation=>params[:password_confirmation],
                         :image_profile=>params[:image_profile]
      ).save()
      Role.add_role_to_user Role.first(:name=>'user'), user # Create role relationship
      user.to_json :except=> :password_digest
    end

    put '/:id', :validate => %i(name email password password_confirmation image_profile) do
      # Update User
      user = User.for_update.first(:id=>params[:id])
      if user.equal?(nil)
        halt 404, {:response=>'Resource no found'}.to_json
      else
        check_regex(Username, params[:name])
        check_regex(Email, params[:email])
        check_password_confirmation(params[:password], params[:password_confirmation])
        check_if_data_resource_exist(User, 'name', params[:name], params[:id])
        check_if_data_resource_exist(User, 'email', params[:email], params[:id])
        user.name = params[:name]
        user.email = params[:email]
        user.password = params[:password]
        user.password_confirmation = params[:password_confirmation]
        user.image_profile = params[:image_profile]
        user.save.to_json :except=> :password_digest
      end
    end

    patch '/:id/:attr' , :validate => %i(value) do
      # Update one attribute of user
      user = User.for_update.first(:id=>params[:id])
      if user.equal?(nil)
        halt 404, {:response=>'Resource no found'}.to_json
      else
        eval("user." + params[:attr] + " = '#{params[:value]}'")
        user.save :validate=>false # Prevent exception for validation plugin
      end
      user.to_json
    end

    delete '/:id' do
      # Delete user
      delete_record(User, params[:id].split(','))
    end

    get '/:id/snippets' do
      # Get the snippets that belongs to a user

      # Check if $limit is a number
      limit = get_sql_limit(params)

      user  = check_if_resource_exist(User, params[:id])

      # Check if pagination is required
      if params[:page] && !params[:page].empty? && !params[:page].nil?
        unless /\A\d+\z/.match(params[:page])
          halt 422, {:response=>'The page parameter is invalid'}.to_json
        end
        page = Snippet.where(:user_id=>user.id).paginate(params[:page].to_i, 4)
        page.count == 0 ? halt(404) : halt(200, page.to_json)
      end

      DB.fetch("SELECT snippets.*,
          (SELECT COUNT(comment_snippets.id)
            FROM comment_snippets WHERE comment_snippets.snippet_id = snippets.id) AS comment_count,
          (SELECT COUNT(like_snippets.id)
            FROM like_snippets WHERE like_snippets.snippet_id = snippets.id) AS like_count
        FROM snippets
          WHERE snippets.user_id = #{user.id}
          ORDER BY comment_count DESC
        " + limit).all.to_json
    end

    get '/:id/proyects' do
      # Get the proyects that belongs to a user

      # Check if $limit is a number
      limit = get_sql_limit(params)

      user = check_if_resource_exist(User, params[:id])

      DB.fetch("SELECT proyects.*,
          (SELECT COUNT(comment_proyects.id)
           FROM comment_proyects WHERE comment_proyects.proyect_id = proyects.id) AS comment_count,
          (SELECT COUNT(like_proyects.id)
           FROM like_proyects WHERE like_proyects.proyect_id = proyects.id) AS like_count
        FROM proyects
          WHERE proyects.user_id = #{user.id}
          ORDER BY comment_count DESC
        " + limit).all.to_json
    end

    patch '/:id/role/:role_name' do
      # Update role of User
      user = User.first(:id=>params[:id])
      if user.equal?(nil)
        halt 404, {:response=>'Resource no found'}.to_json
      else
        if Role.role_exist? params[:role_name]
          # Check si el usuario tiene ese rol con el methodo de user_have_role?
          if RoleUser.user_have_role? params[:id], Role.first(:name=>params[:role_name]).id
            # Si el usuario tiene el rol retornamos un mensaje diciendoloe
            halt 404, {:response=>'Action not allowed, this user already has this role'}.to_json
          else
            # Si el usuario no tiene ese rol se lo asignamos
            # y retornamos un mensaje diciendolo, pero eliminamos su rol anterior
            if params[:role_name].equal? 'admin'
              Role.remove_role_from_user user, Role.first(:name=>'user')
              Role.add_role_to_user user, Role.first(:name=>'admin')
            elsif params[:role_name].equal? 'user'
              Role.remove_role_from_user user, Role.first(:name=>'admin')
              Role.add_role_to_user user, Role.first(:name=>'user')
            end
            {:response=>'Added role successfully'}.to_json
          end
        else
          # Si el rol no existe
          halt 404, {:response=>'Action not allowed, role does not exist'}.to_json
        end
      end
    end

    get '/:id/follow' do
      # User count all follow
      user = check_if_resource_exist(User, params[:id])
      {:response=>RelationShip.where(:follower_id=>user.id).count}.to_json
    end

    get '/:id/followers' do
      # User count all followers
      user = check_if_resource_exist(User, params[:id])
      {:response=>RelationShip.where(:followed_id=>user.id).count}.to_json
    end

    post '/:follower_id/follow/:followed_id' do
      # User :followed_id follow user :follower_id
      followed = check_if_resource_exist(User, params[:followed_id])
      follower = check_if_resource_exist(User, params[:follower_id])

      RelationShip.follow_or_unfollow follower, followed
      {:response=>RelationShip.where(:followed_id=>followed.id).count}.to_json
    end

    get '/:id/statistics/:kind' do
      unless %w(languages frameworks technologys).include? params[:kind]
        halt 400, {:status=>401, :message=> 'Need path languages frameworks technologys'}.to_json
      end

      user = check_if_resource_exist(User, params[:id])
      kind_of_statistic = params[:kind].slice(0..-2) # Remove plural 's' word

      query = DB[:users]
          .join(:snippets, user_id: :id)
          .join(:snippets_tags, snippet_id: :id)
          .join(:tags, id: :tag_id)
          .where {
              Sequel.&(
                {:user_id=>user.id},
                {Sequel[:tags][:description]=>kind_of_statistic}
              )
          }
          .group_and_count(Sequel[:tags][:id])
          .order(:count).reverse
          .select_append(Sequel[:tags][:name])
          .limit(6)
          .all

      query.length == 0 ? halt(404) : halt(200, query.to_json)
    end

  end

end