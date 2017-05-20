require File.dirname(__FILE__) + '/../spec_helper'

describe CommentSnippet do
  before :each do
    @user_have_snippet = User.new(:name => "SnippetMan", :email=>"SnippetMan@gmail.com", :password=>"123456", :password_confirmation=>"123456").save
    @user_comment = User.new(:name => "Audrey", :email=>"Audrey@gmail.com", :password=>"123456", :password_confirmation=>"123456").save
    @snippet = Snippet.new(:filename => "backbone.js", :body=>"Lorem ipsum...", :user_id=>@user_have_snippet.id).save
  end
  context "should be the literal table name" do
    it "should return true" do
      expect(CommentSnippet.simple_table).to eq("`comment_snippets`")
    end
  end
  context "create comment" do
    before :each do
      @user_comment.add_comment_snippet(:title=>"The sad code", :body=>"Sad", :line_code=>2, :snippet_id=>@snippet.id)
    end
    it 'should create' do
      expect(CommentSnippet.where(:snippet_id=>@snippet.id).count).to eq(1)
    end
    context "create without title" do
      before :each do
        @user_comment.add_comment_snippet(:body=>"Sad", :line_code=>2, :snippet_id=>@snippet.id)
      end
      it 'should create' do
        expect(CommentSnippet.where(:snippet_id=>@snippet.id).count).to eq(2)
      end
    end
    context "delete comment" do
      before :each do
        CommentSnippet.first(:snippet_id=>@snippet.id, :user_id=>@user_comment.id).destroy
      end
      it 'should create' do
        expect(CommentSnippet.where(:snippet_id=>@snippet.id).count).to eq(0)
      end
    end
  end
end