class AuthenticatorJWT
  # Check if the request method not is GET and then
  # Verify if the header have the token JWT

  def initialize(app)
    @app = app
  end

  def call(env)
    token   = Rack::Request.new(env).get_header('HTTP_AUTHORIZATION')
    pattern = /^Bearer /
    payload = nil

    if token && token.match(pattern)
      begin
        payload, header = JWT.decode(token.gsub(pattern, ''), @app.settings.verify_key, true, {:algorithm => 'RS256'})

        @exp = header['exp']

        return Rack::Response.new([], 401, {}).finish if @exp.nil?

        @exp = Time.at(@exp.to_i)

        return Rack::Response.new([], 401, {}).finish if Time.now > @exp

      rescue JWT::DecodeError => error
        return Rack::Response.new([], 401, {}).finish
      end
    elsif !Rack::Request.new(env).get?
      return Rack::Response.new([], 401, {}).finish
    end

    Rack::Request.new(env).add_header('X-ID-USER', payload['user_id']) unless payload.nil?

    @app.call(env)
  end
end