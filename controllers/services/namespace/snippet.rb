require './controllers/services/namespace/proyect'

class SnippetNamespace < ProyectNamespace

  helpers ServicesHelpers

  namespace '/snippet' do

    get '/' do
      # Read all snippets
      Snippet.all().to_json
    end

    get '/:id' do
      # Read one snippet by id
      check_if_resource_exist(Snippet, params['id']).to_json
    end

    post '/', :validate => [:filename, :body, :user_id] do
      # Create snippet
      check_nil_string [:filename=>params[:filename],
                        :body=>params[:body],
                        :user_id=>params[:user_id]]
      Snippet.create(:filename=>params[:filename],
                     :body=>params[:body],
                     :user_id=>params[:user_id]).save().to_json
    end

    put '/:id', :validate => [:filename, :body] do
      # Update snippet
      check_nil_string [params[:filename], params[:body]]
      snippet = Snippet.for_update.first(:id=>params[:id])
      if snippet.equal?(nil)
        halt 404, {:response=>"Resource no found"}.to_json
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

    post '/:id/comment', :validate => [:title, :body, :line_code, :user_id ] do
      # Create comment
      check_nil_string [params[:title], params[:body], params[:line_code], params[:user_id]]
      check_if_resource_exist(User, params['user_id'])
      check_if_resource_exist(Snippet, params['id']).add_comment_snippet(
          CommentSnippet.create(:title=>params[:title],
                                :body=>params[:body],
                                :line_code=>params[:line_code],
                                :user_id=>params[:user_id],
                                :snippet_id=>params[:id])).to_json
    end

    put '/:id/comment/:comment_id', :validate => [:title, :body, :line_code] do
      # Edit comment
      check_nil_string [params[:title], params[:body], params[:line_code]]
      check_if_resource_exist(Snippet, params['id'])
      comment = CommentSnippet.for_update.first(:id=>params['comment_id'])
      comment.title = params[:title]
      comment.body = params[:body]
      comment.line_code = params[:line_code]
      comment.save.to_json
    end

    delete '/:id/comment/:comment_id' do
      # Delete comment
      check_if_resource_exist(Snippet, params['id'])
      c = 0
      params['comment_id'].split(',').each { |id|
        check_if_resource_exist(CommentSnippet, id)
        CommentSnippet.delete_comment id
        c += 1
      }
      {:response=>"Resources deleted: #{c}"}.to_json
    end

    post '/:id/like/:user_id' do
      # Create or Delete like
      snippet  = check_if_resource_exist(Snippet, params['id'])
      user = check_if_resource_exist(User, params['user_id'])
      like = LikeSnippet.destroy_or_create(snippet, user)
      if like[0]
        {:response=>"like", :likes=>like[1]}.to_json
      else
        {:response=>"unlike", :likes=>like[1]}.to_json
      end
    end

  end

end
