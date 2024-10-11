/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qn283p90dwvwn1f")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qyfnerl6",
    "name": "version",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qn283p90dwvwn1f")

  // remove
  collection.schema.removeField("qyfnerl6")

  return dao.saveCollection(collection)
})
