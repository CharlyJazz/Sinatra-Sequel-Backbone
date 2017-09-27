migration 'create the comment_snippets table' do
  database.create_table :comment_snippets do
    primary_key :id
    String :title, :size=>24, :null=>true
    String :body, :size=>120, :null=>false
    Integer :line_code, :null=>true
    Timestamp :created_at, null: false
    Timestamp :updated_at
    foreign_key :user_id, :users, :on_delete=>:cascade, :on_update=>:cascade
    foreign_key :snippet_id, :snippets, :on_delete=>:cascade, :on_update=>:cascade
  end
end