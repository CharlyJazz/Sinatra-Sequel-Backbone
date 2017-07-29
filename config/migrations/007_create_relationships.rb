migration "create the relationships table" do
  database.create_table :relationships do
    primary_key :id
    foreign_key :followed_id, :users, :on_update => :cascade, :on_delete => :cascade
    foreign_key :follower_id, :users, :on_update => :cascade, :on_delete => :cascade
  end
end