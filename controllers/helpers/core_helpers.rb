module CoreAppHelpers

  def current_user
    if session[:user]
      user = User[session[:user]]
      if RoleUser.user_have_role? user.id, 'user'
        return AuthUser.new(user.name, user.id)
      elsif RoleUser.user_have_role? user.id, 'admin'
        return Admin.new(user.name, user.id)
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

    return filename
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
  attr_reader :id, :name
  def initialize(name, id)
    @username = name
    @role = 'user'
    @id = id
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
  attr_reader :id, :name
  def initialize(name, id)
    @username = name
    @role = 'admin'
    @id = id
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