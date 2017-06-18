class Proyect < Sequel::Model(:proyects)
  plugin :timestamps
  plugin :validation_helpers
  plugin :json_serializer

  def self.add_snippets(proyect, snippets={})
    count = 0
    while count<=snippets.length-1
      if snippets[count].user_id == proyect.user_id
        ProyectHasSnippet.create(:proyect_id=>proyect.id, :snippet_id=>snippets[count].id)
      end
      count=count+1
    end
  end

  def self.remove_snippets(proyect, snippets={})
    count = 0
    while count<=snippets.length-1
      if snippets[count].user_id == proyect.user_id
        ProyectHasSnippet.first(:proyect_id=>proyect.id, :snippet_id=>snippets[count].id).delete
      end
      count=count+1
    end
  end

  def self.get_snippets(proyect)
    Snippet.where(:id=>ProyectHasSnippet.where(:proyect_id=>proyect.id).select(:snippet_id))
  end

  def self.proyect_have_snippet? proyect_id, snippet_id
    unless ProyectHasSnippet.first(:proyect_id=>proyect_id, :snippet_id=>snippet_id)
      return false
    end
    true
  end

  def validate
    super
    validates_presence [:name, :description]
    validates_max_length 80, :name
    validates_max_length 120, :description
  end

  many_to_one :users
  one_to_many :proyect_has_snippet
  one_to_many :like_proyects
  one_to_many :comment_proyects
  
end