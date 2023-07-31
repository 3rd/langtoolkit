package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		jsonData := `{
			"id": "k91r7u4vdoshp34",
			"created": "2023-07-31 22:00:25.485Z",
			"updated": "2023-07-31 22:00:25.485Z",
			"name": "models",
			"type": "base",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "lahezldq",
					"name": "vendor",
					"type": "select",
					"required": false,
					"unique": false,
					"options": {
						"maxSelect": 1,
						"values": [
							"openai",
							"anthropic",
							"custom"
						]
					}
				},
				{
					"system": false,
					"id": "mbqx1pc4",
					"name": "model",
					"type": "text",
					"required": false,
					"unique": false,
					"options": {
						"min": null,
						"max": null,
						"pattern": ""
					}
				},
				{
					"system": false,
					"id": "7dt4d0dv",
					"name": "enabled",
					"type": "bool",
					"required": false,
					"unique": false,
					"options": {}
				},
				{
					"system": false,
					"id": "5ux8s4fj",
					"name": "available",
					"type": "bool",
					"required": false,
					"unique": false,
					"options": {}
				}
			],
			"indexes": [],
			"listRule": null,
			"viewRule": null,
			"createRule": null,
			"updateRule": null,
			"deleteRule": null,
			"options": {}
		}`

		collection := &models.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return daos.New(db).SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("k91r7u4vdoshp34")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
