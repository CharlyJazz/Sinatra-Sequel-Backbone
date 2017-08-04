Bundler.require

require './config/init'
require './controllers/helpers/core_helpers'

require './lib/json_params'


class CoreController < Sinatra::Base
  require './lib/regex_pattern'

  helpers CoreAppHelpers

  register Sinatra::JsonBodyParams
  register Sinatra::Namespace

  configure do
    enable :protection # https://stackoverflow.com/questions/10509774/sinatra-and-rack-protection-setting
    enable :sessions
    enable :logging

    disable :show_exceptions

    set :template_engine, :erb
    set :root,  Pathname(File.expand_path("../..", __FILE__))
    set :views, 'views'
    set :public_folder, 'public'
    set :static, true
    set :static_cache_control, [:public, max_age: 0]
    set :session_secret, '1a2s3d4f5g6h7j8k9l'
  end

  signing_key_path = File.expand_path("../../app.rsa", __FILE__)

  verify_key_path = File.expand_path("../../app.rsa.pub", __FILE__)

  signing_key, verify_key = '', ''

  File.open(signing_key_path) do |file|
    signing_key = OpenSSL::PKey.read(file)
  end

  File.open(verify_key_path) do |file|
    verify_key = OpenSSL::PKey.read(file)
  end

  set :signing_key, signing_key
  set :verify_key, verify_key

  bower_components = %w[backbone bootstrap codemirror chart.js
                        components-font-awesome jquery
                        jquery-dateFormat MDBootstrap
                        tether underscore backbone.marionette
                        backbone.radio jquery-toast-plugin]

  set :sprockets, Sprockets::Environment.new(root) { |env|
    bower_components.each { | library |
      env.append_path(root.join('public', 'bower_components', library))
    }
    env.append_path(root.join('public', 'stylesheets'))
    env.append_path(root.join('public', 'javascripts'))
    env.js_compressor  = :uglify
    env.css_compressor = :scss
  }

  set(:auth) do |*roles|
    condition do
      unless logged_in? && roles.any? {|role| set_current_user.in_role? role }
        halt 401, {:response=>"Unauthorized access"}
      end
    end
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

  set(:only_owner) do |model|
    condition do
      @model = model[params[:id]] or halt 404
      unless @model.user_id == session[:user]
        halt 401, {:response=>"Unauthorized access"}
      end
    end
  end

end