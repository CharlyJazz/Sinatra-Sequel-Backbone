migration 'create the tags table' do
  database.create_table :tags do
    primary_key :id
    String :name, :size=>24, :unique=>true
    String :description, :size=>36, :null=>true
    Timestamp :created_at, :null=>false
    Timestamp :updated_at
  end
end