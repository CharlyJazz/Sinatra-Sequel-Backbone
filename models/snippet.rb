require_relative '../lib/regex_pattern.rb'
require 'language_sniffer'

class Snippet < Sequel::Model(:snippets)
  plugin :timestamps
  plugin :validation_helpers
  plugin :json_serializer
  
  def self.detect_lang(snippet)
    LanguageSniffer.detect(snippet.filename).language.name
  end

  def validate
    super
    validates_presence [:filename, :body]
    validates_format RegexPattern::Filename, :filename
  end

  many_to_one :users
  many_to_many :tags
  many_to_one :proyect_has_snippet
  one_to_many :like_snippets

end