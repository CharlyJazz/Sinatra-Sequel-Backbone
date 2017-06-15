require './config/init'

class CoreController < Sinatra::Base
  require './lib/regex_pattern'

  register Sinatra::Namespace

  set(:validate) do |*params_array|
    condition do
      params_array.any? do |k|
        unless params.key?(k)
          halt 404, {:response=>"Any parameter are empty or nule"}.to_json
        end
      end

      true

    end
  end

  get '/' do
    "Hello World!"
  end

end