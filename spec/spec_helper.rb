ENV['RACK_ENV'] = 'test'

require File.join(File.dirname(__FILE__), '..', 'app.rb')

Bundler.require(:test)

module RSpecMixin
  RSpec::Expectations.configuration.on_potential_false_positives = :nothing
  include Rack::Test::Methods
  def app() App.new end
end

RSpec.configure { |config|
  config.include RSpecMixin

  config.expect_with :rspec do |c|
    c.syntax = :expect
  end

  config.before(:suite) do
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.clean_with(:truncation)
  end

  config.around(:each) do |example|
    DatabaseCleaner.cleaning do
      example.run
    end
  end
}

# http://recipes.sinatrarb.com/p/testing/rspec