require File.dirname(__FILE__) + '/../spec_helper'
require 'yaml'

describe 'YAML File' do
  before :each do
    @parsed = YAML.load_file(Dir['tmp'][0] + '/tag.yml')
  end
  it 'check if the file loaded' do
    expect(@parsed).to be_kind_of(Hash)
  end
end

describe Tag do
  it 'should return true' do
    expect(Tag.simple_table).to eq('`tags`')
  end
  it 'should no have tag javascript' do
    expect(Tag.where(:name=>'javascript').empty?).to eq(true)
  end
  context 'Crud tag' do
    before :each do
      Tag.create(:name=>'javascript', :description=>'language').save
      @user = User.new(:name => 'Audrey',
                       :email=>'Audrey@gmail.com',
                       :password=>'123456',
                       :password_confirmation=>'123456').save
      @snippet = Snippet.new(:filename => 'backbone.js',
                             :body=>'Lorem ipsum...',
                             :user_id=>@user.id).save
    end
    it 'should have tags' do
      expect(Tag.all.count).to be > 0
    end
    it 'add and remove tag' do
      @snippet.add_tag(Tag.first(:name=>'javascript'))
      expect(@snippet.tags.count).to eq(1)
      @snippet.remove_tag(Tag.first(:name=>'javascript'))
      expect(@snippet.tags.count).to eq(0)
    end
  end
  context 'Search tag for the name' do
    before :each do
      YAML.load_file(Dir['tmp'][0] + '/tag.yml').each { |k,v|
        Tag.create(:name=>k, :description=>v).save
      }
    end
    context 'Search and count `ruby` matches' do
      it 'should have two matches' do
        expect(Tag.where(Sequel.like(:name, '%ruby%')).count).to eq 2
      end
    end
    context 'Search `co` matches' do
      it 'should return coffeescript and codeigniter' do
        expect(Tag.where(Sequel.like(:name, '%co%')).map(:name)).to eq %w[underscore coffeescript phalcon codeigniter]
      end
    end
  end
end