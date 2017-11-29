module ServicesHelpers
  def check_regex(pattern, string)
    halt 404, {:response=>"Invalid #{string} format"}.to_json unless pattern.match(string)
  end

  def check_password_confirmation(password, confirmation)
    halt 404, {:response=>'Password confirmation not matches'}.to_json unless password == confirmation
  end

  def check_if_data_resource_exist(model, attr, string, except_id = {})
    # model     => representation object mapped of table
    # attr      => attribute of table
    # string    => value of attr
    # except_id => record to except in the query
    unless except_id.is_a?(Hash) # Test this, bug ?
      if model.first(:id=>except_id, attr.to_sym=>string) != nil
        return
      elsif model.where{Sequel.&(Sequel.~(:id=> except_id), ({attr.to_sym=>string}))}.kind_of? model
        halt 404, {:response=>'There is already a resource with this data'}.to_json
      end
    end
    if model.first(attr.to_sym=>string) != nil
      halt 404, {:response=>'There is already a resource with this data'}.to_json
    end
  end

  def check_if_resource_exist(model, id)
    record = model.first(:id=>id)
    return halt 404, {:response=>'Resource no found'}.to_json if record.nil?
    record
  end

  def delete_record(model, id)
    c = 0
    id.each { |n|
      record = check_if_resource_exist(model, n)
      record.delete
      c += 1
    }
    {:response=>"Resources deleted: #{c}"}.to_json
  end

  def params_422
    halt 422, {:response=>'Any parameter are empty or null'}.to_json
  end

  def check_nil_string(arg)
    arg.each { |n| params_422 if n.to_s.empty? || n.nil? }
  end

  def param_is_number(params)
    params['$limit'] && /\A\d+\z/.match(params['$limit'])
  end

  def get_sql_limit(params)
    return '' unless param_is_number(params)
    "LIMIT #{params['$limit']}"
  end
end