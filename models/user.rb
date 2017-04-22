class User < Sequel::Model(:user)
  plugin :secure_password
  plugin :timestamps
end