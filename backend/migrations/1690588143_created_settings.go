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
		dao := daos.New(db)

		jsonData := `{
			"id": "ecf32nwgliecijd",
			"created": "2023-07-28 23:49:03.363Z",
			"updated": "2023-07-28 23:49:03.363Z",
			"name": "settings",
			"type": "base",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "izzfo6sv",
					"name": "key",
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
					"id": "kbuspvb0",
					"name": "value",
					"type": "json",
					"required": false,
					"unique": false,
					"options": {}
				}
			],
			"indexes": [
				"CREATE UNIQUE INDEX ` + "`" + `idx_e75LUgj` + "`" + ` ON ` + "`" + `settings` + "`" + ` (` + "`" + `key` + "`" + `)"
			],
			"listRule": "@request.auth.role = \"admin\"",
			"viewRule": "@request.auth.role = \"admin\"",
			"createRule": null,
			"updateRule": "@request.auth.role = \"admin\"",
			"deleteRule": null,
			"options": {}
		}`

		collection := &models.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}
		if err := dao.SaveCollection(collection); err != nil {
			return err
		}

		// openai_enabled
		// openai_api_key
		openaiEnabled := models.NewRecord(collection)
		openaiEnabled.Set("key", "openai_enabled")
		openaiEnabled.Set("value", false)
		if err := dao.SaveRecord(openaiEnabled); err != nil {
			return err
		}
		openaiAPIKey := models.NewRecord(collection)
		openaiAPIKey.Set("key", "openai_api_key")
		openaiAPIKey.Set("value", "")
		if err := dao.SaveRecord(openaiAPIKey); err != nil {
			return err
		}

		// anthropic_enabled
		// anthropic_api_key
		anthropicEnabled := models.NewRecord(collection)
		anthropicEnabled.Set("key", "anthropic_enabled")
		anthropicEnabled.Set("value", false)
		if err := dao.SaveRecord(anthropicEnabled); err != nil {
			return err
		}
		anthropicAPIKey := models.NewRecord(collection)
		anthropicAPIKey.Set("key", "anthropic_api_key")
		anthropicAPIKey.Set("value", "")
		if err := dao.SaveRecord(anthropicAPIKey); err != nil {
			return err
		}

		return nil
	}, func(db dbx.Builder) error {
		dao := daos.New(db)

		collection, err := dao.FindCollectionByNameOrId("ecf32nwgliecijd")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
