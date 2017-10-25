module CoreAppHelpers

  def current_user
    @token = extract_token
    # Try decode token
    begin
      payload, header = JWT.decode(@token, settings.verify_key, true, {:algorithm => 'RS256'})
      @exp = header['exp']
      # Check to see if the exp is set (we don't accept forever tokens)
      if @exp.nil?
        puts 'Access token doesn\'t have exp set.'

        session[:access_token] = nil
        return GuestUser.new
      end
      @exp = Time.at(@exp.to_i)
      puts @exp # DEBUG
      # Make sure the token hasn't expired
      if Time.now > @exp
        puts 'Access token expired.'

        session[:access_token] = nil
        return GuestUser.new
      end
      @user_id = payload['user_id']
      puts "User id: #{@user_id}."
    rescue JWT::DecodeError => e
      puts 'Decode Error.'

      session[:access_token] = nil
      return GuestUser.new
    end

    user = User[@user_id] # Use the payload id_user for search the user

    puts "User: #{user.name}."

    if RoleUser.user_have_role? user.id, 'user'
      puts 'Current user should be a AuthUser.'
      AuthUser.new(user.name, user.email, user.image_profile, user.id)
    elsif RoleUser.user_have_role? user.id, 'admin'
      puts 'Current user should be a Admin.'
      Admin.new(user.name, user.email, user.image_profile, user.id)
    end

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

    File.open(path, 'wb') { |f| f.write(tmpfile.read) }

    filename
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
    token = session[:access_token]

    if token
      return token
    end

    nil
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
  attr_reader :id, :username, :email, :picture
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
  attr_reader :id, :username, :email, :picture
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