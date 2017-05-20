class LikeProyect < Sequel::Model(:like_proyects)
  plugin :timestamps
  
  def self.destroy_or_create(proyect, user)
    if (@this_like = first(:user_id=>user.id)) and @this_like.kind_of? LikeProyect
      @this_like.destroy
    else
      @this_like = create(:user_id=>user.id, :proyect_id=>proyect.id).save
    end
  end

  many_to_one :users
  many_to_one :proyects

end