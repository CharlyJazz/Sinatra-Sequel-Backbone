require './controllers/core'

class TagNamespace < CoreController

  helpers ServicesHelpers

  namespace '/tag' do

    get '/' do
      limit = params[:$limit] || 10
      # Read all tags, filter for the name of description and / or count
      if params['$count'] && !params['$filter']
        halt 200, {:response=>Tag.count}.to_json
      elsif !params['$count'] && params['$filter']
        if params['name']
          query = Tag.where(Sequel.like(:name, '%' + params['name'] + '%')).select(
              :id, :name, :description).limit(limit)
          halt 200, query.to_json
        elsif params['description']
          query = Tag.where(Sequel.like(:name, '%' + params['description'] + '%')).select(
              :id, :name, :description).limit(limit)
          halt 200, query.to_json
        end
      elsif params['$count'] && params['$filter']
        if params['name']
          query = Tag.where(Sequel.like(:name, '%' + params['name'] + '%')).count
          halt 200, {:response=>query}.to_json
        elsif params['description']
          query = Tag.where(Sequel.like(:name, '%' + params['description'] + '%')).count
          halt 200, {:response=>query}.to_json
        end
      end
      Tag.all.to_json
    end

    get '/:id' do
      # Read one tag by id
      check_if_resource_exist(Tag, params['id']).to_json
    end

    post '/', :validate => [:name] do
      # Create tag
      if params[:description]
        check_nil_string [params[:description], params[:name]]
        Tag.create(:name=>params[:name], :description=>params[:description]).save.to_json
      else
        check_nil_string [params[:name]]
        Tag.create(:name=>params[:name]).save.to_json
      end
    end

    put '/:id', :validate => [:name] do
      # Edit tag
      puts "debug"
      check_nil_string [params[:name]]
      puts "debug passing name validator"
      tag = Tag.for_update.first(:id=>params[:id])
      if tag.equal?(nil)
        puts "debug 404"
        halt 404, {:response=>'Resource no found'}.to_json
      else
        puts "debug name"
        tag.name = params[:name]
        if params[:description]
          puts "debug description"
          check_nil_string [params[:description]]
          tag.description = params[:description]
        end
        puts "debug save"
        tag.save.to_json
      end
    end

    delete '/:id' do
      # Delete tag
      delete_record(Tag, params['id'].split(','))
    end

  end

end