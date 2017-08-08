require File.dirname(__FILE__) + '/../spec_helper'

describe CommentSnippet do
  before :each do
    @user_have_snippet = User.new(:name => 'SnippetMan', 
                                  :email=>'SnippetMan@gmail.com',
                                  :password=>'123456',
                                  :password_confirmation=>'123456').save
    @user_comment = User.new(:name => 'Audrey',
                             :email=>'Audrey@gmail.com',
                             :password=>'123456',
                             :password_confirmation=>'123456').save
    @snippet = Snippet.new(:filename => 'backbone.js',
                           :body=>'Lorem ipsum...', :user_id=>@user_have_snippet.id).save
  end
  context 'should be the literal table name' do
    it 'should return true' do
      expect(CommentSnippet.simple_table).to eq('`comment_snippets`')
    end
  end
  context 'create comment' do
    before :each do
      @user_comment.add_comment_snippet(:title=>'The sad code',
                                        :body=>'Sad', :line_code=>2, :snippet_id=>@snippet.id)
    end
    it 'should create' do
      expect(CommentSnippet.where(:snippet_id=>@snippet.id).count).to eq(1)
    end
    context 'create without title' do
      before :each do
        @user_comment.add_comment_snippet(:body=>'Sad', 
                                          :line_code=>2, :snippet_id=>@snippet.id)
      end
      it 'should create' do
        expect(CommentSnippet.where(:snippet_id=>@snippet.id).count).to eq(2)
      end
    end
    context 'delete comment' do
      let(:comment) {CommentSnippet.first(:title=>'The sad code')}
      it 'should delete comment' do
        @user_comment.remove_comment_snippet(comment)
        expect(@user_comment.comment_snippets.count).to eq 0
        comment.destroy
        expect(CommentSnippet.all.count).to eq 0
        expect(CommentSnippet.where(:snippet_id=>@snippet.id).count).to eq(0)
      end
      it 'should delete comment with a way more easy' do
        CommentSnippet.delete_comment comment.id

        expect(@user_comment.comment_snippets.count).to eq 0
        expect(CommentSnippet.all.count).to eq 0
        expect(CommentSnippet.where(:snippet_id=>@snippet.id).count).to eq(0)
      end
    end
  end
end