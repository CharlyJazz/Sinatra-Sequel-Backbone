require 'sinatra/sequel'
require 'sqlite3'

configure :development do
  set :database, 'sqlite://tmp/development.sqlite'
end

configure :test do
  set :database, 'sqlite://tmp/test.sqlite'
end

require './config/migrations'

Sequel::Model.strict_param_setting = false

Dir["./models/**/*.rb"].each{ |model|
  require model
}

# ---- Begin create tables proccess

DB = if ENV['RACK_ENV'] == 'rake'
  Sequel.connect('sqlite://tmp/test.sqlite')
else
  settings.database
end

DB.create_table? :user do
  primary_key :id
  String :name, :unique=>true
  String :password_digest
  String :email, :unique=>true
  String :image_profile, :null=>true
  Timestamp :created_at, null: false
  Timestamp :updated_at
end

DB.create_table? :role do
  primary_key :id
  String :name, :unique=>true
  DateTime :created_on
  DateTime :update_on
end

DB.create_join_table?(:user_id=>:user, :role_id=>:role) # roles_usernames

DB.create_table? :snippet do
  primary_key :id
  String :filename
  String :body, :size=>100*24
  DateTime :created_on
  DateTime :update_on  
  foreign_key :user_id, :user, :on_delete=>:cascade, :on_update=>:cascade
end

DB.create_table? :like_snippet do
  primary_key :id
  DateTime :created_on
  DateTime :update_on    
  foreign_key :user_id, :user, :on_delete=>:cascade, :on_update=>:cascade
  foreign_key :snippet_id, :snippet, :on_delete=>:cascade, :on_update=>:cascade 
end

DB.create_table? :comment_snippet do
  primary_key :id
  String :title, :size=>24, :null=>true 
  String :body, :size=>120, :null=>false
  Integer :line_code, :null=>false
  DateTime :created_on
  DateTime :update_on
  foreign_key :user_id, :user, :on_delete=>:cascade, :on_update=>:cascade
  foreign_key :snippet_id, :snippet, :on_delete=>:cascade, :on_update=>:cascade
end

DB.create_table? :followers do
  primary_key :id
  foreign_key :follower_id, :user, :on_delete=>:cascade, :on_update=>:cascade
  foreign_key :followed_id, :user, :on_delete=>:cascade, :on_update=>:cascade
end

# ---- End create tables proccess

helpers do
  include Rack::Utils
  alias_method :h, :escape_html

  # partial helper taken from Sam Elliot (aka lenary) at http://gist.github.com/119874
  # which itself was based on Chris Schneider's implementation:
  # http://github.com/cschneid/irclogger/blob/master/lib/partials.rb
  def partial(template, *args)
    template_array = template.to_s.split('/')
    template = template_array[0..-2].join('/') + "/_#{template_array[-1]}"
    options = args.last.is_a?(Hash) ? args.pop : {}
    options.merge!(:layout => false)
    if collection = options.delete(:collection) then
      collection.inject([]) do |buffer, member|
        buffer << erb(:"#{template}", options.merge(:layout =>
        false, :locals => {template_array[-1].to_sym => member}))
      end.join("\n")
    else
      erb(:"#{template}", options)
    end
  end
end