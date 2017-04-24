class LikeSnippet < Sequel::Model(:like_snippets)
  plugin :timestamps
  
  many_to_one :users
  many_to_one :snippets

end