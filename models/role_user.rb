class RoleUser < Sequel::Model(:roles_users)

  def self.user_have_role?(user_id, role_id)
    first(:user_id=>user_id, :role_id=>role_id).kind_of?(RoleUser) ? true : false
  end

end