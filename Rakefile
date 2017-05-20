require 'sinatra'
require './config/init'

Bundler.setup

task :spec do
  require 'spec/rake/spectask'
  Spec::Rake::SpecTask.new do |t|
    t.spec_files = FileList['spec/**/*_spec.rb']
  end
end

namespace :db do
  task :create do
    # Create database for tests
    puts DB
  end

  namespace :tag do
    task :create do
      # Insert tag from tag file in the database
      # Quitar este if feo y poner una query que si el name existe pues no volver a crear
      # Asi creo solo los nuevos que estan en el archivo
      if Tag.where(:name=>"javascript").empty? == false then
        puts "The tags have already been uploaded to the database"
      else
        YAML.load_file(Dir["tmp"][0] + '/tag.yml').each { |k,v|
          Tag.create(:name=>k, :description=>v)
        }
      end
    end
    task :update do
      database_tags = {}
      # Update tag.yaml (Rewrite the file) if in the database have new tags
      # First Write in tag.backup.yml the old tags for create secure backup
      File.write(Dir["tmp"][0] + '/tag.backup.yml', YAML.dump(YAML.load(File.read(Dir["tmp"][0] + '/tag.yml'))))
      Tag.all().each { |n| database_tags[n.name] = n.description[0] }
      File.write(Dir["tmp"][0] + '/tag.yml', YAML.dump(database_tags))
    end
  end

  namespace :admin do
    task :create do
      # Create User with the role Admin
    end
    task :delete do
      # Delete Admin User
    end
  end
end