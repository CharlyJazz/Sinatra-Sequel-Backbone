class String
  def is_number?
    true if Float(self) rescue false
  end
end

module CreateAdmin

  def create_admin
    puts 'You will be prompted to enter an username, email and password for the new admin'
    puts 'Name: '
    name = STDIN.gets.chomp
    puts 'Email: '
    email = STDIN.gets.chomp
    puts 'Password: '
    password = STDIN.gets.chomp
    puts 'Repeat password: '
    repeat = STDIN.gets.chomp
    if name.is_number?
      puts 'Sorry, the username need more letters.'
      return
    end
    unless password == repeat
      puts 'Sorry, password not matches.'
      return
    end
    unless email.to_s.empty? || name.to_s.empty? || password.to_s.empty?
      if User.first(:email=>email)
        puts 'Email in use'
        return
      elsif User.first(:name=>name)
        puts 'Name in use'
        return
      else
        @user = User.new(:name => name, :email=>email, :password=>password,
                         :password_confirmation=>repeat).save
        @role = Role.first(:name=>'admin')
        Role.add_role_to_user @role, @user
        puts "The admin was created successfully... Admin: #{name} Date: #{DateTime.now}"
        return
      end
    end
  end

end