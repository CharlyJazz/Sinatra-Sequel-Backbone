class RelationShip < Sequel::Model(:relationships)

  def self.following?(follower, followed)
    where(:followed_id=>followed.id, :follower_id=>follower.id).count > 0
  end

  def self.follow_or_unfollow(follower, followed)
    if self.following?(follower, followed) then
      first(:followed_id=>followed.id, :follower_id=>follower.id).destroy
    else
      create(:follower_id=>follower.id, :followed_id=>followed.id)
    end
  end

end