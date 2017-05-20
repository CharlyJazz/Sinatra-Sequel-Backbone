require File.dirname(__FILE__) + '/../spec_helper'

describe User do
  describe "should be the literal table name" do
    it "expect return true" do
      expect(User.simple_table).to eq("`users`")
    end
  end
  context "create record and failed proccess" do
    it "should raised because password is not present" do
      expect{User.new(:name => "Maggie").save}.to raise_error(Sequel::ValidationFailed)
      expect{User.new(:name => "Maggie", :password=>"123456", :password_confirmation=>"123456").save}.to raise_error(Sequel::ValidationFailed)
    end
    context "create record successfully proccess" do
      before :each do
        @user = User.new(:name => "Audrey", :email=>"Audrey@gmail.com", :password=>"123456", :password_confirmation=>"123456").save
      end
      it "expect create created_at value" do
        expect(@user.id).to eq(1)
        expect(@user.name).to eq("Audrey")
        expect(@user.created_at).to be_kind_of(Time)
        expect(@user.updated_at).to be_kind_of(NilClass)
      end
    end
    context "update record successfully proccess" do
      before :each do
        @user = User.new(:name => "Audrey", :email=>"Audrey@gmail.com", :password=>"123456", :password_confirmation=>"123456").save
        @user.update(:name=>"Maxim")
      end
      it "expect create updated_at value" do
        expect(@user.id).to eq(1)
        expect(@user.name).to eq("Maxim")
        expect(@user.updated_at).to be_kind_of(Time)
      end
    end
    context "delete record successfully proccess" do
      before :each do
        @user = User.new(:name => "Audrey", :email=>"Audrey@gmail.com", :password=>"123456", :password_confirmation=>"123456").save
      end
      it "expect delete user" do
        @user.delete
        expect(User.first(:id=>1)).to eq(nil)
        expect(User.empty?).to eq(true)
      end
      it "expect delete user" do
        User.first(:id=>1).delete
        expect(User.first(:id=>1)).to eq(nil)
        expect(User.empty?).to eq(true)
      end
      it "expect delete user" do
        User.first(:name=>"Audrey", :id=>1).delete
        expect(User.first(:id=>1)).to eq(nil)
        expect(User.empty?).to eq(true)
      end
    end
    context "password matches proccess" do
      before :each do
        @user = User.new(:name => "Audrey", :email=>"Audrey@gmail.com", :password=>"123456", :password_confirmation=>"123456").save
      end
      it "expect password matches" do
        expect(@user.password).to eq(123456.to_s) # Passed only string, not integer
      end
      it "expect password not matches" do
        expect(@user.password).to_not eq(123456)
      end
    end
    context "password update proccess" do
      before :each do
        @user = User.new(:name => "Audrey", :email=>"Audrey@gmail.com", :password=>"123456", :password_confirmation=>"123456").save
        @user.update :password=> "654321", :password_confirmation=> "654321"
      end
      it "expect password matches" do
        expect(@user.password).to eq(654321.to_s)
      end
      it "expect password not matches" do
        expect(@user.password).to_not eq(123456) # Old password
      end
    end
  end
end