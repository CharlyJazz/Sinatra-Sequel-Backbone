class ProyectHasSnippet < Sequel::Model(:proyect_has_snippet)
  plugin :timestamps
  plugin :json_serializer

  many_to_one :proyects
  one_to_many :snippets
end
