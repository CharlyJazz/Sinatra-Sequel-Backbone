migration 'create the users table' do
  database.create_table :users do
    primary_key :id
    String :name, :unique=>true
    String :password_digest
    String :email, :unique=>true
    File :image_profile, :null=>true
    Timestamp :created_at, null: false
    Timestamp :updated_at
  end
end