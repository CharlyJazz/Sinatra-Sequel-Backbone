class App
  require "./controllers/services/interface"
  require "./controllers/auth/auth"
  require "./controllers/website/website"

  attr_reader :app

  def initialize
    @app = Rack::Builder.app do
      map('/') { run WebsiteController }
      map('/api') { run RestInterface }
      map('/auth') { run AuthController }
      map('/assets') { run CoreController.sprockets }
    end
  end

  def call(env)
    app.call(env)
  end
end