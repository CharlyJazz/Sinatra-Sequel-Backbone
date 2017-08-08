require File.dirname(__FILE__) + '/../spec_helper'

describe User do
  describe 'should be the literal table name' do
    it 'expect return true' do
      expect(User.simple_table).to eq('`users`')
    end
  end
  context 'create record and failed proccess' do
    it 'should raised because password is not present' do
      expect{User.new(:name => 'Maggie').save}.to raise_error(Sequel::ValidationFailed)
      expect{User.new(:name => 'Maggie', :password=>'123456',
                      :password_confirmation=>'123456').save}.to raise_error(Sequel::ValidationFailed)
    end
    context 'create record successfully proccess' do
      before :each do
        @user = User.new(:name => 'Audrey', :email=>'Audrey@gmail.com',
                         :password=>'123456', :password_confirmation=>'123456').save
      end
      it 'expect create created_at value' do
        expect(@user.id).to eq(1)
        expect(@user.name).to eq('Audrey')
        expect(@user.created_at).to be_kind_of(Time)
        expect(@user.updated_at).to be_kind_of(NilClass)
      end
    end
    context 'update record successfully proccess' do
      before :each do
        @user = User.new(:name => 'Audrey', :email=>'Audrey@gmail.com',
                         :password=>'123456', :password_confirmation=>'123456').save
        @user.update(:name=>'Maxim')
      end
      it 'expect create updated_at value' do
        expect(@user.id).to eq(1)
        expect(@user.name).to eq('Maxim')
        expect(@user.updated_at).to be_kind_of(Time)
      end
    end
    context 'delete record successfully proccess' do
      before :each do
        @user = User.new(:name => 'Audrey', :email=>'Audrey@gmail.com',
                         :password=>'123456', :password_confirmation=>'123456').save
      end
      it 'expect delete user' do
        @user.delete
        expect(User.first(:id=>1)).to eq(nil)
        expect(User.empty?).to eq(true)
      end
      it 'expect delete user' do
        User.first(:id=>1).delete
        expect(User.first(:id=>1)).to eq(nil)
        expect(User.empty?).to eq(true)
      end
      it 'expect delete user' do
        User.first(:name=>'Audrey', :id=>1).delete
        expect(User.first(:id=>1)).to eq(nil)
        expect(User.empty?).to eq(true)
      end
    end
    context 'password matches proccess' do
      before :each do
        @user = User.new(:name => 'Audrey', :email=>'Audrey@gmail.com',
                         :password=>'123456', :password_confirmation=>'123456').save
      end
      it 'expect password matches' do
        expect(@user.password).to eq(123456.to_s) # Passed only string, not integer
      end
      it 'expect password not matches' do
        expect(@user.password).to_not eq(123456)
      end
    end
    context 'password update proccess' do
      before :each do
        @user = User.new(:name => 'Audrey', :email=>'Audrey@gmail.com',
                         :password=>'123456', :password_confirmation=>'123456').save
        @user.update :password=> '654321', :password_confirmation=> '654321'
      end
      it 'expect password matches' do
        expect(@user.password).to eq(654321.to_s)
      end
      it 'expect password not matches' do
        expect(@user.password).to_not eq(123456) # Old password
      end
    end
  end
  context 'Using the method named serialize' do
    before :each do
      
      @user = User.new(:name=>'charlyjazz', :email=>'charlyjazz@gmail.com',
                       :password=>'123456', :password_confirmation=>'123456',
                       :image_profile=>'imagen.png').save
      
      User.new(:name=>'abcabc', :email=>'abcabc@gmail.com',
                       :password=>'123456', :password_confirmation=>'123456').save
      User.new(:name=>'abcabcabc', :email=>'abcabcabc@gmail.com',
                       :password=>'123456', :password_confirmation=>'123456').save
      User.new(:name=>'dsadsa', :email=>'dsadsa@gmail.com',
                       :password=>'123456', :password_confirmation=>'123456').save
      User.new(:name=>'dsadsadsadsa', :email=>'dsadsadsadsa@gmail.com',
                       :password=>'123456', :password_confirmation=>'123456').save

      RelationShip.create(:followed_id=>2, :follower_id=>@user.id)
      RelationShip.create(:followed_id=>3, :follower_id=>@user.id)

      RelationShip.create(:followed_id=>@user.id, :follower_id=>2)
      RelationShip.create(:followed_id=>@user.id, :follower_id=>3)
      RelationShip.create(:followed_id=>@user.id, :follower_id=>4)

      4.times {
        Snippet.new(:filename => 'backbone.js',
                    :body=>'Lorem ipsum...',
                    :user_id=>@user.id).save
      }
      
      3.times {
        @proyect = Proyect.new(:name=>'github', 
                               :description=>'rails web for git repositories',
                               :user_id=>@user.id).save
      }
      
    end
    let(:json) { JSON.parse(User.serialize @user.id) }
    it 'should the name be equal to charlyjazz' do
      expect(json['name']).to eq 'charlyjazz'
    end
    it 'should the email be equal to charlyjazz@gmail.com' do
      expect(json['email']).to eq 'charlyjazz@gmail.com'
    end
    it 'should the email be equal to imagen.png' do
      expect(json['image_profile']).to eq 'imagen.png'
    end
    it 'should the total followers be equal to 2' do
      expect(json['relationships']['following']).to eq 2
    end
    it 'should the total followings be equal to 3' do
      expect(json['relationships']['followers']).to eq 3
    end
    it 'should the total snippets be equal to 4' do
      expect(json['snippets']['count']).to eq 4
    end
    it 'should the snippets attribute have a HATEOAS' do
      expect(json['snippets']['all']).to start_with '/api/'
    end
    it 'should the total proyects be equal to 3' do
      expect(json['proyects']['count']).to eq 3
    end
    it 'should the proyects attribute have a HATEOAS' do
      expect(json['proyects']['all']).to start_with '/api/'
    end
  end
end