module CoreAppHelpers

  def current_user
    if session[:user]
      user = User[session[:user]]
      if RoleUser.user_have_role? user.id, 'user'
        return AuthUser.new(user.name, user.email, user.picture, user.id)
      elsif RoleUser.user_have_role? user.id, 'admin'
        return Admin.new(user.name, user.email, user.picture, user.id)
      end
    else
      return GuestUser.new
    end

  rescue NoMethodError
    return GuestUser.new

  end

  def set_current_user
    @current_user = current_user
  end

  def logged_in?
    !!session[:user]
  end

  def is_admin?
    set_current_user.permission_level == 2 or halt 401
  end

  def upload_file(id, directory, filename, tmpfile)
    # Prevent error if the filename have spaces e.g: my photo.png to myphoto.png and return.
    ext = (/\.[^.]*$/.match(filename.to_s)).to_s

    filename = "#{id}" + "_" + filename.gsub(/\s.+/, '') + ext

    path = File.join(directory, filename)

    File.open(path, "wb") { |f| f.write(tmpfile.read) }

    filename
  end

  # protected just does a redirect if we don't have a valid token
  def protected!
    return if authorized?
    redirect to('/login') # No me sirve
  end

  # helper to extract the token from the session, header or request param
  # if we are building an api, we would obviously want to handle header or request param
  def extract_token
    # check for the access_token header
    token = request.env["access_token"]

    if token
      return token
    end

    # or the form parameter _access_token
    token = request["access_token"]

    if token
      return token
    end

    # or check the session for the access_token
    token = session["access_token"]

    if token
      return token
    end

    return nil
  end

  # check the token to make sure it is valid with our public key
  def authorized?
    @token = extract_token
    begin
      payload, header = JWT.decode(@token, settings.verify_key, true)

      @exp = header["exp"]

      # check to see if the exp is set (we don't accept forever tokens)
      if @exp.nil?
        puts "Access token doesn't have exp set"
        return false
      end

      @exp = Time.at(@exp.to_i)

      # make sure the token hasn't expired
      if Time.now > @exp
        puts "Access token expired"
        return false
      end

      @user_id = payload["user_id"]

    rescue JWT::DecodeError => e
      return false
    end
  end

end

class GuestUser
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
  attr_reader :id, :name, :email, :picture
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

class Admin
  attr_reader :id, :name, :email, :picture
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