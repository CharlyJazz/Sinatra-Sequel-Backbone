migration "create the snippets table" do
  database.create_table :snippets do
    primary_key :id
    String :filename
    String :body, :size=>100*24
    Timestamp :created_at, null: false
    Timestamp :updated_at
    foreign_key :user_id, :users, :on_delete=>:cascade, :on_update=>:cascade
  end
end