Bundler.setup
require 'yaml'

namespace :db do

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

        YAML.load_file(Dir['tmp'][0] + '/tag.yml').each { |k,v|
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