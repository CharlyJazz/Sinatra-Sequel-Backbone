class Role < Sequel::Model(:roles)
  # dataset_module for extend class with more methods.
  plugin :timestamps
  
  many_to_many :users
  
  def self.role_exist?(name)
    # Search role, if no exist return false
    first(:name=>name).kind_of?(Role) ? true : false
  end

  def self.find_role_or_create(name)
    # Search role and return Dataset, if no exist crete role and return Dataset
    find_or_create(:name=>name)
  end

  def self.add_role_to_user(role, user)
    # Add role to user, create raise !
    user.add_role(role)
  end

  def self.remove_role_from_user(role, user)
    user.remove_role(role)
  end

end