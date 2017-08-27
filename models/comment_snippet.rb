class CommentSnippet < Sequel::Model(:comment_snippets)
  plugin :timestamps
  plugin :validation_helpers
  plugin :json_serializer

  def self.delete_comment id_comment
    @comment = CommentSnippet[id_comment]
    @user = User[@comment.user_id]
    @user.remove_comment_snippet @comment
    @comment.destroy
  end

  def validate
    super
    validates_presence [:body]
    validates_max_length 120, :body
  end

  many_to_one :users
  many_to_one :snippets

end