ENV['RACK_ENV'] = 'test'

require File.join(File.dirname(__FILE__), '..', 'app.rb')

Bundler.require(:test)

RSpec.configure { |config|
  RSpec::Expectations.configuration.on_potential_false_positives = :nothing
  config.color = true
  config.tty = true
  config.formatter = :documentation
  config.success_color = :white
  config.expect_with :rspec do |c|
    c.syntax = :expect
  end

  config.include Rack::Test::Methods

  config.before(:suite) do
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.clean_with(:truncation)
  end

  config.around(:each) do |example|
    DatabaseCleaner.cleaning do
      example.run
    end
  end

  def app() App.new end

}

# http://recipes.sinatrarb.com/p/testing/rspec