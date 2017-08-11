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

* [ ] Create endpoint for add tag to snippet
  
## Resources

    - https://github.com/jeremyevans/sequel/blob/master/lib/sequel/plugins/json_serializer.rb
    - http://sequel.jeremyevans.net/rdoc-plugins/classes/Sequel/Plugins/JsonSerializer.html
    - http://sequel.jeremyevans.net/rdoc-plugins/classes/Sequel/Plugins/Serialization.html
    - https://github.com/nickdufresne/jwt-sinatra-example/blob/master/app.rb
    - https://rietta.com/blog/2012/01/27/openssl-generating-rsa-key-from-command/
    - http://www.odata.org/documentation/odata-version-3-0/url-conventions/
    - http://ricostacruz.com/cheatsheets/sequel.html
    - https://stackoverflow.com/questions/4115115/extract-a-substring-from-a-string-in-ruby-using-a-regular-expression