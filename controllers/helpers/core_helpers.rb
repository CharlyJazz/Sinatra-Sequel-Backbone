module CoreAppHelpers

  def current_user
    id = request.env['X-ID-USER']

    return GuestUser.new if id.nil?

    user = User[id]

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