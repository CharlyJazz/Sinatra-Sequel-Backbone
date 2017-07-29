**Sinatra + Sequel + Backbone = :heart:**

## Feature

Simple web app for create snippets and comments with de power of **Backbone** and **Sinatra** rare style architecture.

Status: **building** :construction:

## Install

1.  Clone the repo.
2.  Install the gems with the command `bundle install`.

## Test

You can test the app with the command `bundle exec rspec path/to/test/file`.

## OpenSSL

This app will load app.rsa and app.rsa.pub as sign and verify keys for the JWT encode and decode

the app.rsa and app.rsa.pub were generated with:

`openssl genrsa -out app.rsa 2048`

`openssl rsa -in app.rsa -pubout > app.rsa.pub`

## Run


1. Create database with the command `bundle exec rake db:create`
2. Create roles with the command `bundle exec rake db:role:create`
3. Create tags with the command `bundle exec rake db:tag:create`
4. Create 2048 bit RSA Key and export the RSA Public Key
5. Run `bundle exec rackup -p 8000`

## TODO

* [x] Create Tables
* [ ] Create task
  * [x] db:tag:create   => Insert tag from tag file in the database
      * [ ] Prevent create tags exist
  * [ ] db:tag:update   => Create backup of tag registered in the database
  * [ ] db:admin:create => Create User with the role Admin
* [x] Create Sequel Models
  * [x] User
  * [x] Role
  * [x] RoleUser
  * [x] Snippet
  * [x] LikeSnippet
  * [x] CommentSnippet
  * [x] Followers
  * [x] Tags
  * [x] Proyects
  * [x] LikeProyect
  * [x] Comment Proyect
* [x] Unit Test for Sequel Models
  * [x] User
  * [x] Role
  * [x] RoleUser
  * [x] Snippet
  * [x] LikeSnippet
  * [x] CommentSnippet
  * [x] Followers
  * [x] Tags
  * [x] Proyects
  * [x] LikeProyect
  * [x] Comment Proyect
* [x] API REST JSON & Unit Test
  * [x] Login & Logout
  * [x] Change Password
  * [x] Register User
  * [x] CRUD For Snippet
  * [x] UnLike/Like Snippet
  * [x] CRUD Comment Snippet
  * [x] Unfollow/Follow User
  * [x] CRUD Proyect
  * [x] CRUD Comment Proyect
  * [x] UnLike/Like Proyect
  * [x] Add/Remove Snippet to Proyect
* [ ] Oauth and Login Sistem
  * [x] Implement sequel_secure_password gem
  * [ ] JWT
  * [ ] Github Oauth
* [ ] Implement Capybara for front-end testing
* [ ] Write main front end
* [ ]  Flash message with help the BMD
* [ ]  Login Page
* [ ]  Change Password
* [ ]  User Setting
* [ ]  User profile with Snippet gallery
* [ ]  Followers page
* [ ]  All Proyects Pagination Page
* [ ]  User Proyects
* [ ]  Create Text Editor
* [ ]  Line specific comment
* [ ]  General Comments snippet
* [ ]  Like snippet
* [ ]  Backbone App

## Resources

    - https://github.com/jeremyevans/sequel/blob/master/lib/sequel/plugins/json_serializer.rb
    - http://sequel.jeremyevans.net/rdoc-plugins/classes/Sequel/Plugins/JsonSerializer.html
    - http://sequel.jeremyevans.net/rdoc-plugins/classes/Sequel/Plugins/Serialization.html
    - https://github.com/nickdufresne/jwt-sinatra-example/blob/master/app.rb
    - https://rietta.com/blog/2012/01/27/openssl-generating-rsa-key-from-command/