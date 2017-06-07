Bundler.require(:default)
require 'sinatra/sequel'
require 'sqlite3'

configure :development do
  set :database, 'sqlite://tmp/development.sqlite'
end

configure :test do
  set :database, 'sqlite://tmp/test.sqlite'
end

require './config/migrations'
require './config/endpoint'


Sequel::Model.strict_param_setting = false

Dir["./models/**/*.rb"].each{ |model|
  require model
}

# ---- Begin create tables proccess

DB = settings.database

DB.create_table? :users do
  primary_key :id
  String :name, :unique=>true
  String :password_digest
  String :email, :unique=>true
  String :image_profile, :null=>true
  Timestamp :created_at, null: false
  Timestamp :updated_at
end

DB.create_table? :roles do
  primary_key :id
  String :name, :unique=>true
  Timestamp :created_at, null: false
  Timestamp :updated_at
end

DB.create_join_table?(:role_id=>:roles, :user_id=>:users)

DB.create_table? :snippets do
  primary_key :id
  String :filename
  String :body, :size=>100*24
  Timestamp :created_at, null: false
  Timestamp :updated_at
  foreign_key :user_id, :users, :on_delete=>:cascade, :on_update=>:cascade
end

DB.create_table? :like_snippets do
  primary_key :id
  Timestamp :created_at, null: false
  Timestamp :updated_at
  foreign_key :user_id, :users, :on_delete=>:cascade, :on_update=>:cascade
  foreign_key :snippet_id, :snippets, :on_delete=>:cascade, :on_update=>:cascade
end

DB.create_table? :comment_snippets do
  primary_key :id
  String :title, :size=>24, :null=>true
  String :body, :size=>120, :null=>false
  Integer :line_code, :null=>false
  Timestamp :created_at, null: false
  Timestamp :updated_at
  foreign_key :user_id, :users, :on_delete=>:cascade, :on_update=>:cascade
  foreign_key :snippet_id, :snippets, :on_delete=>:cascade, :on_update=>:cascade
end

DB.create_table? :relationships do
  primary_key :id
  foreign_key :followed_id, :users, :on_update => :cascade, :on_delete => :cascade
  foreign_key :follower_id, :users, :on_update => :cascade, :on_delete => :cascade
end

DB.create_table? :tags do
  primary_key :id
  String :name, :size=>24
  String :description, :size=>36
  Timestamp :created_at, null: false
  Timestamp :updated_at
end

DB.create_join_table?(:tag_id=>:tags, :snippet_id=>:snippets)

DB.create_table? :proyects do
  primary_key :id
  String :name, :size=>80
  String :description, :size=>120
  Timestamp :created_at, null: false
  Timestamp :updated_at
  foreign_key :user_id, :users, :on_delete=>:cascade, :on_update=>:cascade
end

DB.create_table? :proyect_has_snippet do
  primary_key :id
  Timestamp :created_at, null: false
  Timestamp :updated_at
  foreign_key :proyect_id, :proyects, :on_delete=>:cascade, :on_update=>:cascade
  foreign_key :snippet_id, :snippets, :on_delete=>:cascade, :on_update=>:cascade
end

DB.create_table? :like_proyects do
  primary_key :id
  Timestamp :created_at, null: false
  Timestamp :updated_at
  foreign_key :user_id, :users, :on_delete=>:cascade, :on_update=>:cascade
  foreign_key :proyect_id, :proyects, :on_delete=>:cascade, :on_update=>:cascade
end

DB.create_table? :comment_proyects do
  primary_key :id
  String :body, :size=>250, :null=>false
  Timestamp :created_at, null: false
  Timestamp :updated_at
  foreign_key :user_id, :users, :on_delete=>:cascade, :on_update=>:cascade
  foreign_key :proyect_id, :proyects, :on_delete=>:cascade, :on_update=>:cascade
end

# ---- End create tables proccess