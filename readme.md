**Sinatra + Sequel + Backbone = :heart:**

Feature:
-----
Simple web app for create snippets and comments with de power of Backbone and Sinatra simple style architecture.


Status: **building** :construction:


TODO:
-----
* [ ] Read: [RubyMine Keyboard Shortcuts](https://www.jetbrains.com/help/ruby/2017.1/keyboard-shortcuts-you-cannot-miss.html)
* [ ] Test delete all models for prevent delete in cascade error
* [x] Create Tables
* [ ] Create task
    * [ ] db:tag:create   => Insert tag from tag file in the database
        * [ ] Prevent create tags exist
    * [x] db:tag:update   => Update tag.yaml (Rewrite the file)
    * [ ] db:admin:create => Create User with the role Admin
    * [ ] db:admin:delete => Delete Admin User
* [ ] Create Sequel Models
    * [x] User
    * [x] Role
    * [x] RoleUser
    * [x] Snippet
    * [x] LikeSnippet
    * [x] CommentSnippet
    * [x] Followers
    * [x] Tags
    * [ ] Proyects
    * [ ] LikeProyect
    * [ ] Comment Proyect
* [ ] Unit Test for Sequel Models
    * [ ] Refactor with FactoryGirl
    * [x] User
    * [x] Role
    * [x] RoleUser
    * [x] Snippet
    * [x] LikeSnippet
    * [x] CommentSnippet
    * [x] Followers
    * [x] Tags
    * [ ] Proyects
    * [ ] LikeProyect
    * [ ] Comment Proyect
* [ ] API REST JSON & Unit Test
    * [ ] Login & Logout
    * [ ] Change Password
    * [ ] Register User
    * [ ] CRUD For Snippet
    * [ ] UnLike/Like Snippet
    * [ ] CRUD Comment Snippet
    * [ ] Unfollow/Follow User
    * [ ] CRUD Proyect
    * [ ] CRUD Comment Proyect
    * [ ] UnLike/Like Proyect
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
  * [ ]  Use WOW.js for cool effects
* [ ]  Create Text Editor
  * [ ]  Line specific comment
  * [ ]  General Comments snippet
  * [ ]  Like snippet
* [ ] Backbone App