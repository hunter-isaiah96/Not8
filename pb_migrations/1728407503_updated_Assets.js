/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qn283p90dwvwn1f")

  collection.name = "assets"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qn283p90dwvwn1f")

  collection.name = "Assets"

  return dao.saveCollection(collection)
})
