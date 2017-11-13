require 'rubygems'
require 'bundler'
Bundler.require

require './app'

use PDFKit::Middleware

run App.new # Run master!