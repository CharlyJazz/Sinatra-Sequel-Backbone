source 'https://rubygems.org'

gem 'rack'
gem 'sinatra'
gem 'sinatra-extension'
gem 'sinatra-flash'
gem 'sinatra-contrib'
gem 'sinatra-redirect-with-flash', require: 'sinatra/redirect_with_flash'
gem 'sinatra-sequel', '~> 0.9.0'
gem 'sequel_secure_password'
gem 'sequel'
gem 'rake'
gem 'language_sniffer', :git => 'git://github.com/grosser/language_sniffer.git', require: false
gem 'octicons' #https://github.com/primer/octicons_gem 

group :test, :development do #  bundle install --with test development
  gem 'sqlite3'
end

group :test do #  bundle install --with test 
  gem 'rspec'
  gem 'rack-test'
  gem 'capybara', '~>2.12.0'
  gem 'selenium-webdriver'
  gem 'webdrivers', '~> 2.3'
  gem 'database_cleaner'
end