module SlimHelpers

  def asset_path(source)
    '/assets/' + settings.sprockets.find_asset(source).digest_path
  end

end