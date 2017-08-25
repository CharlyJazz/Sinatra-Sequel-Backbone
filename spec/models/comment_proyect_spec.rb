require File.dirname(__FILE__) + '/../spec_helper'

describe CommentProyect do
  before :each do
    @user_have_proyect = User.new(:name => 'SnippetMan',
                                  :email=>'SnippetMan@gmail.com',
                                  :password=>'123456',
                                  :password_confirmation=>'123456').save
    @user_comment = User.new(:name => 'Audrey',
                             :email=>'Audrey@gmail.com',
                             :password=>'123456',
                             :password_confirmation=>'123456').save
    @proyect = Proyect.new(:name=>'github',
                           :description=>'rails web for git repositories',
                           :user_id=>@user_have_proyect.id).save
  end
  context 'should be the literal table name' do
    it 'should return true' do
      expect(CommentProyect.simple_table).to eq('`comment_proyects`')
    end
  end
  context 'create comment' do
    before :each do
      @user_comment.add_comment_proyect(:body=>'Sad coding lorem ipsum',
                                        :proyect_id=>@proyect.id)
    end
    it 'should create' do
      expect(CommentProyect.where(:proyect_id=>@proyect.id).count).to eq(1)
    end
    context 'delete comment' do
      let(:comment) {CommentProyect.first(:body=>'Sad coding lorem ipsum',
                                          :proyect_id=>@proyect.id)}
      it 'should delete comment' do
        @user_comment.remove_comment_proyect(comment)
        expect(@user_comment.comment_proyects.count).to eq 0
        comment.destroy
        expect(CommentProyect.all.count).to eq 0
        expect(CommentProyect.where(:proyect_id=>@proyect.id).count).to eq(0)
      end
      it 'should delete comment with a way more easy' do
        CommentProyect.delete_comment comment.id

        expect(@user_comment.comment_proyects.count).to eq 0
        expect(CommentProyect.all.count).to eq 0
        expect(CommentProyect.where(:proyect_id=>@proyect.id).count).to eq(0)
      end
    end
  end
end