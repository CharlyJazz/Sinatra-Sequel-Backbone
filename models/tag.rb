class Tag < Sequel::Model(:tags)
  plugin :timestamps
  plugin :validation_helpers

  def validate
    super
    validates_presence [:name, :description]
    validates_max_length 24, :name
    validates_max_length 32, :description    
  end

  many_to_many :snippets

end