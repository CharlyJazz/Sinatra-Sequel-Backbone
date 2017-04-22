require File.dirname(__FILE__) + '/../spec_helper'

describe User do
    describe "should be the literal table name" do
      it "expect return nil" do
        expect(User.simple_table).to eq("`user`")
      end
    end
    describe "create record and failed proccess" do
      it "should raised because password is not present" do
        expect{User.new(:name => "Maggie").save}.to raise_error(Sequel::ValidationFailed)
      end
    describe "create records successfully proccess" do
      before :each do
        @user = User.new(:name => "Audrey", :password=>"123456")
        @user.password_confirmation = "123456"
        @user.save
      end
      it "expect return one or the other" do
        expect(@user.id).to eq(1)
        expect(@user.name).to eq("Audrey")
        expect(@user.created_at).to be_kind_of(Time)
      end
    end
  end
end