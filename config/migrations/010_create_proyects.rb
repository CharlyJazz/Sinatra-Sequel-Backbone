migration "create the proyects table" do
  database.create_table :proyects do
    primary_key :id
    String :name, :size=>80
    String :description, :size=>120
    Timestamp :created_at, null: false
    Timestamp :updated_at
    foreign_key :user_id, :users, :on_delete=>:cascade, :on_update=>:cascade
  end
end