source :rubygems

ruby '2.4.2'

gem 'jwt', '2.1.0'
gem 'rack', '2.0.3'
gem 'sinatra', '2.0.0'
gem 'sinatra-extension', '1.0'
gem 'sinatra-contrib', '2.0.0'
gem 'sinatra-sequel', '~> 0.9.0'
gem 'sequel_secure_password', '0.2.15'
gem 'sequel', '~> 5.1.0'
gem 'rake', '~> 12.0.0'
gem 'language_sniffer', :git => 'git://github.com/grosser/language_sniffer.git', require: false
gem 'sprockets'
gem 'multi_json', '1.12.2'
gem 'wkhtmltopdf-heroku', '2.12.4.0'
gem 'pdfkit', '~> 0.8.2'

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