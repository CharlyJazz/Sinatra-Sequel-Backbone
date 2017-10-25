class LikeProyect < Sequel::Model(:like_proyects)
  plugin :timestamps

  def self.destroy_or_create(proyect, user)
    # Return array with boolean and the total the likes of the proyects
    if (@this_like = first(:user_id=>user.id, :proyect_id=>proyect.id)) and @this_like.kind_of? LikeProyect
      @this_like.destroy
      [false, where(:proyect_id=>proyect.id).count]
    else
      @this_like = create(:user_id=>user.id, :proyect_id=>proyect.id).save
      [true, where(:proyect_id=>proyect.id).count]
    end
  end

  many_to_one :users
  many_to_one :proyects

end