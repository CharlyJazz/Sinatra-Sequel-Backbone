migration 'create the snippets_tags table' do
  database.create_join_table(
    :tag_id=>:tags,
    :snippet_id=>:snippets
  )
end