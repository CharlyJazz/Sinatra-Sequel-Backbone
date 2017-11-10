module CoreAppHelpers

  def current_user
    @token = bearer_token
    # Try decode token
    begin
      payload, header = JWT.decode(@token, settings.verify_key, true, {:algorithm => 'RS256'})
      @exp = header['exp']
      # Check to see if the exp is set (we don't accept forever tokens)
      if @exp.nil?
        puts 'Access token doesn\'t have exp set.'
        return GuestUser.new
      end
      @exp = Time.at(@exp.to_i)
      # Make sure the token hasn't expired
      if Time.now > @exp
        puts 'Access token expired.'
        return GuestUser.new(:expired=>true)
      end
      @user_id = payload['user_id']
    rescue JWT::DecodeError => e
      puts 'Decode Error.'
      return GuestUser.new
    end

    user = User[@user_id] # Use the payload id_user for search the user

    if RoleUser.user_have_role? user.id, 'user'
      puts 'Current user should be a AuthUser.'
      AuthUser.new(user.name, user.email, user.image_profile, user.id)
    elsif RoleUser.user_have_role? user.id, 'admin'
      puts 'Current user should be a Admin.'
      Admin.new(user.name, user.email, user.image_profile, user.id)
    end

  end

  def bearer_token
    pattern = /^Bearer /
    header  = request.env['HTTP_AUTHORIZATION'] # <= env
    header.gsub(pattern, '') if header && header.match(pattern)
  end

  def set_current_user
    @current_user = current_user
  end

  def is_admin?
    set_current_user.permission_level == 2 or halt 401
  end

end

class GuestUser
  attr_accessor :expired
  def initialize(params = {})
    @expired = params.fetch(:expired, false)
  end

  def permission_level
    0
  end

  def is_anonimous
    true
  end
  # current_user.admin? returns false. current_user.has_a_baby? returns false.
  # (which is a bit of an assumption I suppose)
  def method_missing(m, *args)
    return false
  end
end

class AuthUser
  attr_reader :id, :username, :email, :picture, :role
  def initialize(name, email, picture, id)
    @username = name
    @email = email
    @picture = picture
    @id = id
    @role = 'user'
  end

  def permission_level
    1
  end

  def is_authenticated
    true
  end
  # current_user.admin? returns false. current_user.has_a_baby? returns false.
  # (which is a bit of an assumption I suppose)
  def method_missing(m, *args)
    return false
  end
end

class Admin
  attr_reader :id, :username, :email, :picture, :role
  def initialize(name, email, picture, id)
    @username = name
    @email = email
    @picture = picture
    @id = id
    @role = 'admin'
  end

  def permission_level
    2
  end

  def in_role? role
    @role.equal? role
  end

  def is_authenticated
    true
  end
  # current_user.admin? returns false. current_user.has_a_baby? returns false.
  # (which is a bit of an assumption I suppose)
  def method_missing(m, *args)
    return false
  end
end