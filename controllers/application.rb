class WEB < Sinatra::Base
  include Endpoint
  # Web Application
  get '/' do
    "Hello World!"
  end

end