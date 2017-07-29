migration "create the proyect_has_snippet table" do
  database.create_table :proyect_has_snippet do
    primary_key :id
    Timestamp :created_at, null: false
    Timestamp :updated_at
    foreign_key :proyect_id, :proyects, :on_delete=>:cascade, :on_update=>:cascade
    foreign_key :snippet_id, :snippets, :on_delete=>:cascade, :on_update=>:cascade
  end
end