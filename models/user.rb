class User < Sequel::Model(:users)
  plugin :secure_password
  plugin :timestamps
  plugin :validation_helpers
  plugin :json_serializer

  def validate
    super
    validates_presence [:name, :password, :password_confirmation, :email]
    validates_format RegexPattern::Email, :email
    validates_format RegexPattern::Username, :name
  end

  def self.serialize id
    # Return user information with proyects and snippets data
    # Todo traerme todo esto en una sola consulta y crear JSON
    user = first :id=>id

    { :name=>user.name,
      :email=>user.email,
      :image_profile=>user.image_profile,
      :relationships=>{
        :following=>RelationShip.where(:follower_id=>id).count,
        :followers=>RelationShip.where(:followed_id=>id).count
      },
      :snippets=>{
        :count=>Snippet.where(:user_id=>id).count,
        :all=>"/api/user/#{id}/snippets"
      },
      :proyects=>{
            :count=>Proyect.where(:user_id=>id).count,
            :all=>"/api/user/#{id}/proyects"
      }
    }.to_json

  end
  
  many_to_many :roles
  one_to_many :snippets
  one_to_many :proyects
  one_to_many :like_proyects
  one_to_many :like_snippets
  one_to_many :comment_snippets
  one_to_many :comment_proyects
end