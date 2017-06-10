module ServicesHelpers
  def check_regex(pattern, string, message=nil)
    unless pattern.match(string)
      halt 404, {:response=>"Invalid #{string} format"}.to_json
    end
  end
  def check_password_confirmation(password, confirmation)
    unless password == confirmation
      halt 404, {:response=>"Password confirmation not matches"}.to_json
    end
  end
  def check_if_data_resource_exist(model, attr, string, except_id = {})
    if !except_id.is_a?(Hash)
      if model.first(:id=>except_id, attr.to_sym=>string) != nil
        # Si es el correo, o la clave o cualquiera que sea el campo
        # original del modelo a editar entonces nos salimos de aca
        return

      elsif model.where{Sequel.&(Sequel.~(:id=> except_id), ({attr.to_sym=>string}))}.kind_of? model
        # Si es el correo, o la clave o cualquiera que sea el campo
        # original de un modelo que no es el que hay que editar entonces
        # significa que no podemos editarlo porque deberia ser unique=true
        # asi que lanzamos el 404
        # TODO: TESTEAR ESTO, tendria que crear otro user y hacer que el primer user intente editar sus datos con algunos de los de el, y debe entrar aca
        # query = model.where{Sequel.&(Sequel.~(:id=> except_id), ({attr.to_sym=>string}))}
        # print query.kind_of? User
        halt 404, {:response=>"There is already a resource with this data"}.to_json
      end
    end
    if model.first(attr.to_sym=>string) != nil
      # Pero si no hay un except_id, o sea, el id del modelo a editar,
      # entonces vemos si existe ya este campo FUNCIONAL
      halt 404, {:response=>"There is already a resource with this data"}.to_json
    end
  end
  def check_if_resource_exist(model, id)
    record = model.first(:id=>id)
    if record.equal?(nil)
      halt 404, {:response=>"Resource no found"}.to_json
    end
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
  def params_404
    halt 404, {:response=>"Any parameter are empty or nule"}.to_json
  end
  def check_nil_string arg
    arg.each { |n|
      if n.empty? || n.nil?
        params_404
      end
    }
  end
end