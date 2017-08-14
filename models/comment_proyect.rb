class CommentProyect < Sequel::Model(:comment_proyects)
  plugin :timestamps
  plugin :validation_helpers
  plugin :json_serializer

  def self.delete_comment id_comment
    @comment = CommentProyect[id_comment]
    @user = User[@comment.user_id]
    @user.remove_comment_proyect @comment
    @comment.destroy
  end

  def validate
    super
    validates_presence [:body]
    validates_max_length 250, :body
  end

  many_to_one :users
  many_to_one :proyects

end