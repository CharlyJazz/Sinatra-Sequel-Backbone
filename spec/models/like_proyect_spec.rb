require File.dirname(__FILE__) + '/../spec_helper'

describe LikeProyect do
  context "should be the literal table name" do
    it "should return true" do
      expect(LikeProyect.simple_table).to eq("`like_proyects`")
    end
  end
end