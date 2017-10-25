class LikeSnippet < Sequel::Model(:like_snippets)
  plugin :timestamps
  plugin :json_serializer

  def self.destroy_or_create(snippet, user)
    # Return array with boolean and the total the likes of the snippets
    if (@this_like = first(:user_id=>user.id, :snippet_id=>snippet.id)) and @this_like.kind_of? LikeSnippet
      @this_like.destroy
      [false, where(:snippet_id=>snippet.id).count]
    else
      @this_like = create(:user_id=>user.id, :snippet_id=>snippet.id).save
      [true, where(:snippet_id=>snippet.id).count]
    end
  end

  many_to_one :users
  many_to_one :snippets

end