package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models/schema"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("k91r7u4vdoshp34")
		if err != nil {
			return err
		}

		// add
		new_external_created_at := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "emroe8v6",
			"name": "external_created_at",
			"type": "number",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null
			}
		}`), new_external_created_at)
		collection.Schema.AddField(new_external_created_at)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("k91r7u4vdoshp34")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("emroe8v6")

		return dao.SaveCollection(collection)
	})
}
