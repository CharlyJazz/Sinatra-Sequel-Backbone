class CommentSnippet < Sequel::Model(:comment_snippets)
  plugin :timestamps
  plugin :validation_helpers

  def validate
    super
    validates_presence [:body, :line_code]
    validates_max_length 120, :body
    validates_integer :line_code
  end

  many_to_one :users
  many_to_one :snippets

end