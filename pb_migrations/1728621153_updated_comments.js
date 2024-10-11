/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ros3a9lxwabtdc0")

  // remove
  collection.schema.removeField("kl0r1enb")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ros3a9lxwabtdc0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kl0r1enb",
    "name": "timestamp",
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
})
