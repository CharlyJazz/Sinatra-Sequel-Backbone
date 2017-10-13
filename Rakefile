Bundler.setup
require 'yaml'

namespace :db do

  task :populate do
    require './config/init'

    file = YAML.load_file(Dir['tmp'][0] + '/populate.yml')
    file.each do |user|
      user_record = User.create(:name=>user['name'], :email=>user['email'],
                                :password=>user['password_digest'],
                                :image_profile=>user['image_profile'],
                                :password_confirmation=>user['password_digest'])

      user_record.save

      Role.add_role_to_user Role.first(:name=>'user'), user_record

      user['snippets'].each do |snippet|
        snippet_record = Snippet.create(:filename=>snippet['filename'],
                                        :body=>snippet['body'],
                                        :user_id=>user_record.id)

        snippet_record.save

        snippet['tags'].each do |tag|
          tag_record = Tag.first(:name=>tag)
          snippet_record.add_tag(tag_record)
        end
      end
    end
  end

  namespace :role do

    task :create do
      # Create de roles admin and user
      require './config/init'

      %w[admin user].each { | role |
        if Role.first(:name=>role)
          puts "The role #{role} already exist"
        else
          Role.new(:name=>role).save
        end
      }

    end

  end

  namespace :tag do

    task :create do
      # Create tag writed in the file tag.yml
      require './config/init'

      YAML.load_file(Dir['tmp'][0] + '/tag.yml').each { |k, v|
        if Tag.first(:name=>k).equal? nil
          puts "Creating tag named '#{k}'"
          Tag.create(:name=>k, :description=>v).save
        end
      }

    end

    task :backup do
      # Create backup of tags writed in tag file
      require './config/init'

      File.write(Dir['tmp'][0] + '/tag.backup.yml',
                 YAML.dump(YAML.load(File.read(Dir['tmp'][0] + '/tag.yml'))))

    end

  end

  namespace :admin do

    task :create do
      # Create admin user
      require './config/init'
      require './lib/create_admin'

      include CreateAdmin

      create_admin

    end

  end

end