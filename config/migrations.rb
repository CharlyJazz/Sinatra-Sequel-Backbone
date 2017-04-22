# Migrations will run automatically. The DSL like wrapper syntax is courtesy 
# of sinatra-sequel
#
# For details on sequel's schema modifications, check out:

=begin
migration "create the people table" do
  database.create_table :people do
    primary_key :id 
    string      :name
  end
end
=end