Bundler.setup
require 'sinatra'

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
end