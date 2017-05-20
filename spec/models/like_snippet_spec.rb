require File.dirname(__FILE__) + '/../spec_helper'

describe LikeSnippet do
  before :each do
    @user_have_snippet = User.new(:name => "SnippetMan", :email=>"SnippetMan@gmail.com", :password=>"123456", :password_confirmation=>"123456").save
    @user_like_1 = User.new(:name => "Audrey", :email=>"Audrey@gmail.com", :password=>"123456", :password_confirmation=>"123456").save
    @user_like_2 = User.new(:name => "Alex", :email=>"Alex@gmail.com", :password=>"123456", :password_confirmation=>"123456").save
    @snippet = Snippet.new(:filename => "backbone.js", :body=>"Lorem ipsum...", :user_id=>@user_have_snippet.id).save
  end
  context "should be the literal table name" do
    it "should return true" do
      expect(LikeSnippet.simple_table).to eq("`like_snippets`")
    end
  end
  context "create and remove like" do
    before :each do
      @user_like_1.add_like_snippet(:snippet_id=>@snippet.id)
      @like_snippet = LikeSnippet.first(:user_id=>@user_like_1.id)
    end
    it "should create like" do
      expect(@like_snippet).to be_kind_of(LikeSnippet)
      expect(@user_like_1.like_snippets.empty?).to eq(false)
    end
    it "should remove like" do
      @like_snippet.destroy
      expect(@like_snippet).to be_kind_of(LikeSnippet)
      expect(@user_like_1.like_snippets.empty?).to eq(true)
    end
    context "check if any user have like in a snippet" do
      it "should this user not have like" do
        expect(LikeSnippet.first(:user_id=>@user_like_2.id)).to_not be_kind_of(LikeSnippet)
      end
    end
    context "create several likes" do
      it "should be two likes" do
        @user_like_2.add_like_snippet(:snippet_id=>@snippet.id)
        expect(LikeSnippet.all.length).to eq(2)
      end
    end
    context "like snippet special method" do
      it 'call several times the like add-remove method' do

        LikeSnippet.destroy_or_create(@snippet, @user_like_1) # destroy like
        expect(LikeSnippet.where(:snippet_id=>@snippet.id, :user_id=>@user_like_1.id).count).to eq(0)

        LikeSnippet.destroy_or_create(@snippet, @user_like_1) # create like
        expect(LikeSnippet.where(:snippet_id=>@snippet.id, :user_id=>@user_like_1.id).count).to eq(1)

        LikeSnippet.destroy_or_create(@snippet, @user_like_2) # create like
        expect(LikeSnippet.where(:snippet_id=>@snippet.id, :user_id=>@user_like_2.id).count).to eq(1)

        expect(LikeSnippet.where(:snippet_id=>@snippet.id).count).to eq(2)

      end
    end
  end
end