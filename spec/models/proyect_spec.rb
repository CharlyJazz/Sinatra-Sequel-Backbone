require File.dirname(__FILE__) + '/../spec_helper'

describe Proyect do
  before(:each) do
    @user = User.new(:name => 'Audrey', :email=>'Audrey@gmail.com',
                     :password=>'123456', :password_confirmation=>'123456').save
    @proyect = Proyect.new(:name=>'github',
                           :description=>'rails web for git repositories',
                           :user_id=>@user.id).save
  end
  context 'should be the literal table name' do
    it 'expect return true' do
      expect(Proyect.simple_table).to eq('`proyects`')
    end
  end
  context 'delete, create, edit proyect' do
    it 'should have one proyect' do
      expect(Proyect.all.length).to eq(1)
    end
    it 'should not have proyect' do
      @proyect.delete
      expect(Proyect.all.length).to eq(0)
      expect(User.all.length).to eq(1)
    end
    it 'should change the name' do
      expect(@proyect.name).to eq('github')
      expect(Proyect.first(:name=>@proyect.name)).to be_kind_of(Proyect)
    end
  end
  context 'add snippet with the proyect_has_snippet model' do
    before(:each) do
      @snippet = Snippet.new(:filename => 'backbone.js',
                             :body=>'Lorem ipsum...', :user_id=>@user.id).save
      ProyectHasSnippet.create(:proyect_id=>@proyect.id,
                               :snippet_id=>@snippet.id)
    end
    it 'should add snippet to proyect' do
      expect(ProyectHasSnippet.first(:proyect_id=>@proyect.id)).to be_kind_of(ProyectHasSnippet)
      expect(@proyect.proyect_has_snippet.length).to eq(1)
    end
  end
  context 'especial method' do
    context 'add snippets' do
      before(:each) do
        @snippet_1 = Snippet.new(:filename => 'filename1.js',
                                 :body=>'Lorem ipsum...', :user_id=>@user.id).save
        @snippet_2 = Snippet.new(:filename => 'filename2.js',
                                 :body=>'Lorem ipsum...', :user_id=>@user.id).save
        @snippet_3 = Snippet.new(:filename => 'filename3.js',
                                 :body=>'Lorem ipsum...', :user_id=>@user.id).save
      end
      it 'should have 3 snippets' do
        Proyect.add_snippets(@proyect, [@snippet_1, @snippet_2, @snippet_3])
        expect(@proyect.proyect_has_snippet.length).to eq(3)
      end
    end
    context 'remove snippet' do
      before(:each) do
        @snippet = Snippet.new(:filename => 'backbone.js',
                               :body=>'Lorem ipsum...', :user_id=>@user.id).save
        ProyectHasSnippet.create(:proyect_id=>@proyect.id,
                                 :snippet_id=>@snippet.id)
      end
      it 'should remove snippet' do
        expect(ProyectHasSnippet.first(:proyect_id=>@proyect.id,
                                       :snippet_id=>@snippet.id)).to be_kind_of(ProyectHasSnippet)
        Proyect.remove_snippets(@proyect, [@snippet]) # Delete
        expect(ProyectHasSnippet.first(:proyect_id=>@proyect.id,
                                       :snippet_id=>@snippet.id)).to_not be_kind_of(ProyectHasSnippet)
      end
    end
  end
end
