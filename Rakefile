Bundler.setup
require 'yaml'

namespace :db do

  namespace :role do

    task :create do
      # Create de roles admin and user
      require './config/init'
      
      ["admin", "user"].each { | role |
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

        YAML.load_file(Dir["tmp"][0] + '/tag.yml').each { |k,v|
          Tag.create(:name=>k, :description=>v)
        }

    end

    task :update do
      # Update tag.yaml (Rewrite the file) if the database have new tags
      require './config/init'

      database_tags = {}

      File.write(Dir["tmp"][0] + '/tag.backup.yml', YAML.dump(YAML.load(File.read(Dir["tmp"][0] + '/tag.yml'))))

      Tag.all().each { |n| 
        database_tags[n.name] = n.description
      }

      File.write(Dir["tmp"][0] + '/tag.yml', YAML.dump(database_tags))

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