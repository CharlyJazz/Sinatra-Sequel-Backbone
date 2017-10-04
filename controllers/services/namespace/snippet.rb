require './controllers/services/namespace/proyect'

class SnippetNamespace < ProyectNamespace

  helpers ServicesHelpers

  namespace '/snippet' do

    get '/' do
      # Read all snippets
      if params[:page] && !params[:page].empty? && !params[:page].nil?
        unless /\A\d+\z/.match(params[:page])
          halt 422, {:response=>'The page parameter is invalid'}.to_json
        end
        page = Snippet.dataset.paginate(params[:page].to_i, 4)
        page.count == 0 ? halt(404) : halt(200, page.to_json)
      end
      Snippet.all.to_json
    end

    get '/:id' do
      # Read one snippet by id
      check_if_resource_exist(Snippet, params[:id]).to_json
    end

    post '/', :validate => %i(filename body user_id) do
      # Create snippet
      check_nil_string [:filename=>params[:filename],
                        :body=>params[:body],
                        :user_id=>params[:user_id]]
      Snippet.create(:filename=>params[:filename],
                     :body=>params[:body],
                     :user_id=>params[:user_id]).save().to_json
    end

    put '/:id', :validate => %i(filename body) do
      # Update snippet
      check_nil_string [params[:filename], params[:body]]
      snippet = Snippet.for_update.first(:id=>params[:id])
      if snippet.nil?
        halt 404, {:response=>'Resource no found'}.to_json
      else
        snippet.filename = params[:filename]
        snippet.body = params[:body]
        snippet.save.to_json
      end
    end

    delete '/:id' do
      # Delete snippet
      delete_record(Snippet, params['id'].split(','))
    end

    get '/:id/comment' do
      # Read Comments of snippet
      check_if_resource_exist(Snippet, params['id']).comment_snippets.to_json
    end

    post '/:id/comment', :validate => %i(body user_id) do
      # Create comment, the line_code or title are optional
      check_nil_string [params[:body], params[:user_id]]

      attr = {:body=>params[:body], :snippet_id=>params[:id]}

      unless params[:title].to_s.empty? || params[:title].nil?
        attr[:title] = params[:title]
      end

      unless params[:line_code].to_s.empty? || params[:line_code].nil?
        attr[:line_code] = params[:line_code]
      end

      check_if_resource_exist(User, params[:user_id])

      attr[:user_id] = params[:user_id]

      check_if_resource_exist(Snippet, params[:id]).add_comment_snippet(
          CommentSnippet.create(attr)).to_json
    end

    put '/:id/comment/:comment_id', :validate => %i(body) do
      # Edit comment
      check_nil_string [params[:body]]

      check_if_resource_exist(Snippet, params[:id])

      comment = CommentSnippet.for_update.first(:id=>params[:comment_id])
      comment.line_code = params[:line_code]
      comment.title = params[:title]
      comment.body = params[:body]
      comment.save.to_json
    end

    delete '/:id/comment/:comment_id' do
      # Delete comment
      check_if_resource_exist(Snippet, params[:id])
      c = 0
      params[:comment_id].split(',').each { |id|
        check_if_resource_exist(CommentSnippet, id)
        CommentSnippet.delete_comment id
        c += 1
      }
      {:response=>"Resources deleted: #{c}"}.to_json
    end

    get '/:id/like' do
      snippet  = check_if_resource_exist(Snippet, params['id'])
      likes = LikeSnippet.where(:snippet_id=>snippet.id).count
      {:response=>'likes count', :likes=>likes}.to_json
    end

    post '/:id/like/:user_id' do
      # Create or Delete like
      snippet  = check_if_resource_exist(Snippet, params['id'])
      user = check_if_resource_exist(User, params['user_id'])
      like = LikeSnippet.destroy_or_create(snippet, user)
      if like[0]
        {:response=>'like', :likes=>like[1]}.to_json
      else
        {:response=>'unlike', :likes=>like[1]}.to_json
      end
    end

    get '/:id/tag' do
      # Get all tags of the snippet
      check_if_resource_exist(Snippet, params['id']).tags.to_json
    end

    post '/:id/tag', :validate => %i(name) do
      # Create Relationship snippet with the tags
      # If the tag not exist then create without description
      check_nil_string [params[:name]]
      snippet = check_if_resource_exist(Snippet, params['id'])
      params[:name].split(',').each { |name|
        tag = Tag.first(:name=>name)
        if tag.nil?
          tag = Tag.create(:name=>name).save
        end
        snippet.add_tag tag
      }
      {:response=>'Tags added successfully'}.to_json
    end

    delete '/:id/tag', :validate => %i(name) do
      # Remove tag relationship
      check_nil_string [params[:name]]
      snippet = check_if_resource_exist(Snippet, params['id'])
      params[:name].split(',').each { |name|
        tag = Tag.first(:name=>name)
        unless tag.nil?
          snippet.remove_tag tag
        end
      }
      {:response=>'Tags removed successfully'}.to_json
    end

  end

end