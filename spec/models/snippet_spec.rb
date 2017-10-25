require File.dirname(__FILE__) + '/../spec_helper'
require 'yaml'

describe Snippet do
  before :each do
    @user = User.new(:name => 'Audrey',
                     :email=>'Audrey@gmail.com',
                     :password=>'123456',
                     :password_confirmation=>'123456').save
  end
  context 'should be the literal table name' do
    it 'should return true' do
      expect(Snippet.simple_table).to eq('`snippets`')
    end
  end
  context 'create snippet'
  it 'should raise error' do
    expect{Snippet.new(:filename => 'name',
                       :body=>'Lorem ipsum...',
                       :user_id=>@user.id).save}.to raise_error(Sequel::ValidationFailed)
  end
  it 'should create' do
    expect{Snippet.new(:filename => 'name.py',
                       :body=>'Lorem ipsum...',
                       :user_id=>@user.id).save}.to_not raise_error(Sequel::ValidationFailed)
  end
  context 'detected language of a file' do
    before :each do
      @snippet = Snippet.new(:filename => 'backbone.js', :body=>'Lorem ipsum...',
                             :user_id=>@user.id).save
    end
    it 'should create' do
      expect(Snippet.detect_lang(@snippet)).to eq('JavaScript')
    end
  end
  context 'delete snippet that does relations with any table' do
    before :each do
      @snippet = Snippet.new(:filename => 'backbone.js',
                             :body=>'Lorem ipsum...',
                             :user_id=>@user.id).save
    end
    context 'delete snippet that does relations with any comments' do
      before :each do
        @user.add_comment_snippet(:title=>'The sad code',
                                  :body=>'Sad',
                                  :line_code=>2,
                                  :snippet_id=>@snippet.id)
      end
      it 'should delete the snippet' do
        expect(Snippet.all.length).to eq 1
        @snippet.delete
        expect(Snippet.all.length).to eq 0
      end
    end
    context 'delete snippet that does relations with any like' do
      before :each do
        @user.add_like_snippet(:snippet_id=>@snippet.id)
      end
      it 'should delete the snippet' do
        expect(Snippet.all.length).to eq 1
        @snippet.delete
        expect(Snippet.all.length).to eq 0
      end
    end
    context 'delete snippet that does relations with any tag' do
      before :each do
        Tag.create(:name=>'javascript', :description=>'language').save
        @snippet.add_tag(Tag.first(:name=>'javascript'))
      end
      it 'should delete the snippet' do
        expect(Snippet.all.length).to eq 1
        @snippet.delete
        expect(Snippet.all.length).to eq 0
        expect(Tag.all.length).to eq 1
      end
    end
  end
end