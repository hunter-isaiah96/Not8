/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qn283p90dwvwn1f")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "c6rytx3f",
    "name": "metadata",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qn283p90dwvwn1f")

  // remove
  collection.schema.removeField("c6rytx3f")

  return dao.saveCollection(collection)
})
