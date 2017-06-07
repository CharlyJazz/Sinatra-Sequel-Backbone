require './config/init'

class App
  require "./controllers/services"
  require "./controllers/application"

  attr_reader :app

  def initialize
    @app = Rack::Builder.app do
      [WEB, API].each do |e|
        map(e.prefix) { run(e.new) }
      end
    end
  end

  def call(env)
    app.call(env)
  end
end