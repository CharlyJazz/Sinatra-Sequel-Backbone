migration 'create the like_snippets table' do
  database.create_table :like_snippets do
    primary_key :id
    Timestamp :created_at, null: false
    Timestamp :updated_at
    foreign_key :user_id, :users, :on_delete=>:cascade, :on_update=>:cascade
    foreign_key :snippet_id, :snippets, :on_delete=>:cascade, :on_update=>:cascade
  end
end