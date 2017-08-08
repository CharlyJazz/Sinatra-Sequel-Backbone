require File.dirname(__FILE__) + '/../spec_helper'

describe Role do
  describe 'should be the literal table name' do
    it 'expect return true' do
      expect(Role.simple_table).to eq('`roles`')
    end
  end
  context 'create role proccess' do
    before :each do
      @role = Role.new(:name=>'user').save
    end
    it 'should create role' do
      expect(@role.id).to eq(1)
      expect(@role.name).to eq('user')
      expect(@role.created_at).to be_kind_of(Time)
    end
  end
  context 'search a role' do
    before :each do
      @role = Role.new(:name=>'user').save
    end
    it 'should search user role' do
      expect(Role.first(:name => 'user')).to be_kind_of(Role)
    end
    it 'should not search admin role' do
      expect(Role.first(:name => 'admin')).to_not be_kind_of(Role)
    end
  end
  context 'role special methods' do
    it 'find or create, should will create' do
      Role.find_role_or_create('user')
      expect(Role.first(:name=>'user')).to be_kind_of(Role)
    end
    it 'check if role user exist, should false' do
      expect(Role.role_exist?('user')).to eq(false)
    end
    it 'check if role admin exist, should true' do
      Role.find_role_or_create('admin')
      expect(Role.role_exist?('admin')).to eq(true)
    end
    context 'add role to user' do
      before :each do
         @role = Role.new(:name=>'admin').save
         @user = User.new(:name => 'Audrey', :email=>'Audrey@gmail.com', :password=>'123456', :password_confirmation=>'123456').save
      end
      it 'should create role~user relation' do
        Role.add_role_to_user(@role, @user)
        expect(RoleUser.first(:user_id=>@user.id)).to be_kind_of(RoleUser)
        expect(RoleUser.first(:user_id=>@user.id).role_id).to eq(1)
      end
    end
    context 'remove role to user' do
      before :each do
         @role = Role.new(:name=>'admin').save
         @user = User.new(:name => 'Audrey', :email=>'Audrey@gmail.com',  :password=>'123456', :password_confirmation=>'123456').save
         @user.add_role(@role)
      end
      it 'should create role~user relation' do
        Role.remove_role_from_user(@role, @user)
        expect(RoleUser.first(:user_id=>@user.id)).to be_kind_of(NilClass)
      end
    end
    context RoleUser do
      context 'check if user have a role' do
        before :each do
          @role = Role.new(:name=>'admin').save
          @user_1 = User.new(:name => 'Audrey', :email=>'Audrey@gmail.com',  :password=>'123456', :password_confirmation=>'123456').save
          @user_2 = User.new(:name => 'Fernand', :email=>'Fernand@gmail.com',  :password=>'123456', :password_confirmation=>'123456').save
          @user_1.add_role(@role)
        end
        it 'should return true' do
          expect(RoleUser.user_have_role? @user_1.id, @role.id).to eq true
        end
        it 'should return false' do
          expect(RoleUser.user_have_role? @user_2.id, @role.id).to eq false
        end
        it 'should return true' do
          role = Role.first(:name=>'admin')
          expect(RoleUser.user_have_role? @user_1.id, role.id).to eq true
        end
      end
    end
  end
end