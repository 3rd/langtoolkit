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

		collection, err := dao.FindCollectionByNameOrId("uvrwnd6etykp5k9")
		if err != nil {
			return err
		}

		// add
		new_output := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "9rwb32rh",
			"name": "output",
			"type": "text",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_output)
		collection.Schema.AddField(new_output)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("uvrwnd6etykp5k9")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("9rwb32rh")

		return dao.SaveCollection(collection)
	})
}
