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
			"id": "uvrwnd6etykp5k9",
			"created": "2023-07-29 09:48:06.283Z",
			"updated": "2023-07-29 09:48:06.283Z",
			"name": "completions",
			"type": "base",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "szw0nga6",
					"name": "vendor",
					"type": "text",
					"required": true,
					"unique": false,
					"options": {
						"min": null,
						"max": null,
						"pattern": ""
					}
				},
				{
					"system": false,
					"id": "6ametqnb",
					"name": "model",
					"type": "text",
					"required": true,
					"unique": false,
					"options": {
						"min": null,
						"max": null,
						"pattern": ""
					}
				},
				{
					"system": false,
					"id": "g4nwszz5",
					"name": "input",
					"type": "json",
					"required": true,
					"unique": false,
					"options": {}
				},
				{
					"system": false,
					"id": "yy752hxh",
					"name": "status",
					"type": "select",
					"required": true,
					"unique": false,
					"options": {
						"maxSelect": 1,
						"values": [
							"pending",
							"success",
							"error"
						]
					}
				},
				{
					"system": false,
					"id": "a9d9kukt",
					"name": "user",
					"type": "relation",
					"required": true,
					"unique": false,
					"options": {
						"collectionId": "_pb_users_auth_",
						"cascadeDelete": false,
						"minSelect": null,
						"maxSelect": 1,
						"displayFields": []
					}
				},
				{
					"system": false,
					"id": "l6ptv8gk",
					"name": "source",
					"type": "select",
					"required": true,
					"unique": false,
					"options": {
						"maxSelect": 1,
						"values": [
							"playground",
							"app",
							"api"
						]
					}
				},
				{
					"system": false,
					"id": "aljhrmxe",
					"name": "parameters",
					"type": "json",
					"required": false,
					"unique": false,
					"options": {}
				},
				{
					"system": false,
					"id": "obpcfzdy",
					"name": "response",
					"type": "json",
					"required": false,
					"unique": false,
					"options": {}
				},
				{
					"system": false,
					"id": "5tqd50kv",
					"name": "error",
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
					"id": "txgiiqgt",
					"name": "consumedAt",
					"type": "date",
					"required": false,
					"unique": false,
					"options": {
						"min": "",
						"max": ""
					}
				},
				{
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
				}
			],
			"indexes": [],
			"listRule": "@request.auth.role = \"admin\" || @request.auth.id = user.id",
			"viewRule": "@request.auth.role = \"admin\" || @request.auth.id = user.id",
			"createRule": "@request.auth.role = \"admin\" || @request.auth.id = user.id",
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

		collection, err := dao.FindCollectionByNameOrId("uvrwnd6etykp5k9")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
