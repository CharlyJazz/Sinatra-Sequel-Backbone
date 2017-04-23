class User < Sequel::Model(:users)
  plugin :secure_password
  plugin :timestamps

  many_to_many :roles

end