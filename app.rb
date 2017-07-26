class App
  require "./controllers/services/interface"
  require "./controllers/auth/auth"

  attr_reader :app

  def initialize
    @app = Rack::Builder.app do
      map('/api') { run RestInterface }
      map('/auth') { run AuthController }
    end
  end

  def call(env)
    app.call(env)
  end
end