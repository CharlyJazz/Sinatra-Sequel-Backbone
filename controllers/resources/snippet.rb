module Sinatra
  module SnippetResources

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

      app.get '/snippet' do
        Snippet.all().to_json
      end

      app.get '/snippet/:id' do
        snippet = check_if_resource_exist(Snippet, params['id'])
        snippet.to_json
      end

      app.post '/snippet', :validate => [:filename, :body, :user_id] do
        snippet = Snippet.create(:filename=>params[:filename],
                       :body=>params[:body],
                       :user_id=>params[:user_id]).save()
        snippet.to_json
      end

      app.put '/snippet/:id', :validate => [:filename, :body] do
        [params[:filename], params[:body]].each { |n|
          if n.empty? || n.nil?
            params_404
          end
        }
        snippet = Snippet.for_update.first(:id=>params[:id])
        if snippet.equal?(nil)
          halt 404, {:response=>"Resource no found"}.to_json
        else
          snippet.filename = params[:filename]
          snippet.body = params[:body]
          snippet.save
          snippet.to_json
        end
      end

      app.delete '/snippet/:id' do
        delete_record(Snippet, params['id'].split(','))
      end

      app.post '/snipppet/:id/comment', :validate => [:title, :body, :line_code,
                                                       :user_id, :snippet_id] do
        #TODO: hacer esto
      end

      app.put '/snippet/:id/comment', :validate => [:title, :body, :line_code,
                                                      :user_id, :snippet_id] do
        #TODO: hacer esto
      end

      app.delete '/snippet/:id/comment/:user_id' do
        #TODO: hacer esto
      end

      app.post '/snippet/:id/like/:user_id' do
        #TODO hacer esto, toogle like
      end

    end

  end
  register SnippetResources
end