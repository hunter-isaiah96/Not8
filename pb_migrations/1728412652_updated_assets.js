/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qn283p90dwvwn1f")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "drli5wjy",
    "name": "thumbnail",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [],
      "thumbs": [],
      "maxSelect": 1,
      "maxSize": 5242880,
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qn283p90dwvwn1f")

  // remove
  collection.schema.removeField("drli5wjy")

  return dao.saveCollection(collection)
})
