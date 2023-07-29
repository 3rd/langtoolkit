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

		// update
		edit_consumed_at := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "txgiiqgt",
			"name": "consumed_at",
			"type": "date",
			"required": false,
			"unique": false,
			"options": {
				"min": "",
				"max": ""
			}
		}`), edit_consumed_at)
		collection.Schema.AddField(edit_consumed_at)

		// update
		edit_resolved_at := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "mfinm16t",
			"name": "resolved_at",
			"type": "date",
			"required": false,
			"unique": false,
			"options": {
				"min": "",
				"max": ""
			}
		}`), edit_resolved_at)
		collection.Schema.AddField(edit_resolved_at)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("uvrwnd6etykp5k9")
		if err != nil {
			return err
		}

		// update
		edit_consumed_at := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "txgiiqgt",
			"name": "consumedAt",
			"type": "date",
			"required": false,
			"unique": false,
			"options": {
				"min": "",
				"max": ""
			}
		}`), edit_consumed_at)
		collection.Schema.AddField(edit_consumed_at)

		// update
		edit_resolved_at := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "mfinm16t",
			"name": "resolvedAt",
			"type": "date",
			"required": false,
			"unique": false,
			"options": {
				"min": "",
				"max": ""
			}
		}`), edit_resolved_at)
		collection.Schema.AddField(edit_resolved_at)

		return dao.SaveCollection(collection)
	})
}
