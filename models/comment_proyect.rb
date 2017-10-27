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
    validates_max_length 450, :body
  end

  def user_name
    self[:user_name] || users.name
  end

  def user_picture
    self[:user_picture] || users.image_profile
  end

  def user_id
    self[:user_id] || users.id
  end

  many_to_one :users
  many_to_one :proyects

end