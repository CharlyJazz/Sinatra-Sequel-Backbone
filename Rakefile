Bundler.setup
require 'sinatra'
require './config/init'

task :spec do
  require 'spec/rake/spectask'

  Spec::Rake::SpecTask.new do |t|
    t.spec_files = FileList['spec/**/*_spec.rb']
  end
end

namespace :db do
    task :create do
      ENV['RACK_ENV'] = 'rake'
      require_relative './config/init'
      puts DB
    end
    task :tag do
      if Tag.where(:name=>"javascript").empty? == false then
        puts "The tags have already been uploaded to the database"
      else
        YAML.load_file(Dir["tmp"][0] + '/tag.yml').each { |k,v|
          Tag.create(:name=>k, :description=>v)
        }
      end
    end
end