class Tag < Sequel::Model(:tags)
  plugin :timestamps
  plugin :validation_helpers
  plugin :json_serializer

  def validate
    super
    validates_presence [:name]
    validates_max_length 24, :name
  end

  many_to_many :snippets

end