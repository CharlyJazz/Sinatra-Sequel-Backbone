module Sinatra
  module ProyectResources

    def self.registered(app)

      app.set(:validate) do |*params_array|
        condition do
          params_array.any? do |k|
            unless params.key?(k)
              halt 404, {:response=>"Any parameter are empty or nule"}.to_json
            end
          end

          true # Continue :)

        end
      end

      app.get '/proyect' do
        # Read all proyect
        Proyect.all().to_json
      end

      app.get '/proyect/:id' do
        # Read one proyect by id
        check_if_resource_exist(Proyect, params['id']).to_json
      end

      app.post '/proyect' do
        # Create proyect
      end

      app.put '/proyect/:id' do
        # Edit proyect
      end

      app.delete '/proyect/:id' do
        # Delete proyect
        delete_record(Proyect, params['id'].split(','))
      end

      app.get '/proyect/:id/comment' do
        # Read Comments of snippet
        check_if_resource_exist(Proyect, params['id']).comment_proyects.to_json
      end

      app.post '/proyect/:id/comment', :validate => [:body, :user_id] do
        # Create comment
      end

      app.put '/proyect/:id/comment/:comment_id', :validate => [:body] do
        # Edit comment
      end

      app.delete '/proyect/:id/comment/:comment_id' do
        # Delete Comments of proyet
      end

      app.get '/proyect/:id/snippet' do
        # All snippet of proyect
      end

      app.post '/proyect/:id/snippet/:id_snippet' do
        # Add snippet to proyect
        # Proyect.add_snippets
      end

      app.delete '/proyect/:id/snippet/:id_snippet' do
        # Remove snippet to proyect
        # Proyect.remove_snippets
      end

    end

  end
  register ProyectResources
end

