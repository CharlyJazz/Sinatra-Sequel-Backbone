**Sinatra + Sequel + Backbone = :heart:**

## Feature

Simple web app for create snippets and comments with de power of **Backbone** and **Sinatra** rare style architecture.

Status: **building** :construction:

## TODO

* [ ] Test delete all models for prevent delete in cascade error
* [x] Create Tables
* [ ] Create task
  * [ ] db:tag:create   => Insert tag from tag file in the database
      * [ ] Prevent create tags exist
  * [x] db:tag:update   => Update tag.yaml (Rewrite the file)
  * [ ] db:admin:create => Create User with the role Admin
  * [ ] db:admin:delete => Delete Admin User
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
* [ ] API REST JSON & Unit Test
  * [ ] Login & Logout
  * [x] Change Password
  * [x] Register User
  * [x] CRUD For Snippet
  * [x] UnLike/Like Snippet
  * [x] CRUD Comment Snippet
  * [x] Unfollow/Follow User
  * [x] CRUD Proyect
  * [x] CRUD Comment Proyect
  * [x] UnLike/Like Proyect
  * [ ] Add/Remove Snippet to Proyect
  * [ ] Github Oauth
* [ ] Oauth and Login Sistem
  * [x] Implement sequel_secure_password gem
  * [ ] Github Oauth
  * [ ] Unit Test for this
* [ ] Implement Capybara for front-end testing
* [ ] Write main front end
* [ ]  ITCSS and Sass
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
* [ ] Backbone App

## Resources

    - https://github.com/jeremyevans/sequel/blob/master/lib/sequel/plugins/json_serializer.rb
    - http://sequel.jeremyevans.net/rdoc-plugins/classes/Sequel/Plugins/JsonSerializer.html
    - http://sequel.jeremyevans.net/rdoc-plugins/classes/Sequel/Plugins/Serialization.html
