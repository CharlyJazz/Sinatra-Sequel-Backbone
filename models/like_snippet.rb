class LikeSnippet < Sequel::Model(:like_snippets)
  plugin :timestamps
  
  def self.destroy_or_create(snippet, user)
    if (@this_like = first(:user_id=>user.id)) and @this_like.kind_of? LikeSnippet
      @this_like.destroy
    else
      @this_like = create(:user_id=>user.id, :snippet_id=>snippet.id).save
    end
  end

  many_to_one :users
  many_to_one :snippets

end