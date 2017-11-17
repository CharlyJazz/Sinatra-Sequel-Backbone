source :rubygems

ruby "2.4.2"

gem 'jwt'
gem 'rack'
gem 'sinatra'
gem 'sinatra-extension'
gem 'sinatra-flash'
gem 'sinatra-contrib'
gem 'sinatra-redirect-with-flash', require: 'sinatra/redirect_with_flash'
gem 'sinatra-sequel', '~> 0.9.0'
gem 'sequel_secure_password'
gem 'sequel'
gem 'rake', '~> 12.0.0'
gem 'language_sniffer', :git => 'git://github.com/grosser/language_sniffer.git', require: false
gem 'uglifier'
gem 'sprockets'
gem 'sass'
gem 'coffee-script'
gem 'multi_json'
gem 'wkhtmltopdf-heroku'
gem 'pdfkit'

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