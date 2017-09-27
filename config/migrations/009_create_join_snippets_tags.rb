migration 'create the snippets_tags table' do
  database.create_join_table(
      :tag_id=>{:table=>:tags, :on_update => :cascade,:on_delete=>:cascade},
      :snippet_id=>{:table=>:snippets, :on_update => :cascade,:on_delete=>:cascade}
  )
end