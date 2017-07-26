Bundler.require

require './config/init'
require './controllers/helpers/core_helper'


class CoreController < Sinatra::Base
  require './lib/regex_pattern'

  helpers CoreAppHelpers

  register Sinatra::Namespace

  configure do
    enable :sessions
    enable :logging
    enable :show_exceptions
    set :root,  Pathname(File.expand_path("../..", __FILE__))
    set :views, 'views'
    set :public_folder, 'public'
    set :static, true
    set :static_cache_control, [:public, max_age: 0]
    set :session_secret, '1a2s3d4f5g6h7j8k9l'
  end

  set(:validate) do |*params_array|
    condition do
      params_array.any? do |k|
        unless params.key?(k)
          # https://stackoverflow.com/questions/3050518/what-http-status-response-code-should-i-use-if-the-request-is-missing-a-required
          halt 422, {:response=>"Any parameter are empty or nule"}.to_json
        end
      end
      true # Return true
    end
  end

end