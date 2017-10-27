migration 'create the comment_proyects table' do
  database.create_table :comment_proyects do
    primary_key :id
    String :body, :size=>450, :null=>false
    Timestamp :created_at, null: false
    Timestamp :updated_at
    foreign_key :user_id, :users, :on_delete=>:cascade, :on_update=>:cascade
    foreign_key :proyect_id, :proyects, :on_delete=>:cascade, :on_update=>:cascade
  end
end