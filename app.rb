class App
  require "./controllers/rest/interface"

  attr_reader :app

  def initialize
    @app = Rack::Builder.app do
      map('/api') { run RestInterface }
    end
  end

  def call(env)
    app.call(env)
  end
end