require File.dirname(__FILE__) + '/../spec_helper'

describe LikeProyect do
  context 'should be the literal table name' do
    it 'should return true' do
      expect(LikeProyect.simple_table).to eq('`like_proyects`')
    end
  end
  context 'special methods' do
    context 'destroy and create like' do
      before(:each) do
        @user_proyect= User.new(:name => 'Brat', :email=>'Brat@gmail.com',
                                :password=>'123456', :password_confirmation=>'123456').save
        @user_liked = User.new(:name => 'Audrey', :email=>'Audrey@gmail.com',
                               :password=>'123456', :password_confirmation=>'123456').save
        @proyect = Proyect.new(:name=>'github', :description=>'rails web for git repositories',
                               :user_id=>@user_proyect.id).save
      end
      it 'should create like' do
        LikeProyect.destroy_or_create(@proyect, @user_liked)
        expect(LikeProyect.where(:proyect_id=>@proyect.id, :user_id=>@user_liked.id).count).to eq(1)
        LikeProyect.destroy_or_create(@proyect, @user_liked)
        expect(LikeProyect.where(:proyect_id=>@proyect.id, :user_id=>@user_liked.id).count).to eq(0)
      end
    end
  end
end