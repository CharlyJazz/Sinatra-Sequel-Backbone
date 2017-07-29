migration "create the like_proyects table" do
  database.create_table :like_proyects do
    primary_key :id
    Timestamp :created_at, null: false
    Timestamp :updated_at
    foreign_key :user_id, :users, :on_delete=>:cascade, :on_update=>:cascade
    foreign_key :proyect_id, :proyects, :on_delete=>:cascade, :on_update=>:cascade
  end
end