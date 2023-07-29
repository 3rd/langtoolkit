package api

import (
	"github.com/pocketbase/pocketbase/daos"
)

type Settings struct {
	OpenAIEnabled    bool   `json:"openai_enabled"`
	OpenAIAPIKey     string `json:"openai_api_key"`
	AnthropicEnabled bool   `json:"anthropic_enabled"`
	AnthropicAPIKey  string `json:"anthropic_api_key"`
}

func GetSettings(dao *daos.Dao) (*Settings, error) {
	settings := &Settings{}

	// openai enabled
	openAIEnabled, err := dao.FindFirstRecordByData("settings", "key", "openai_enabled")
	if err != nil {
		return nil, err
	}
	openAIEnabled.UnmarshalJSONField("value", &settings.OpenAIEnabled)

	// openai api key
	openAIAPIKey, err := dao.FindFirstRecordByData("settings", "key", "openai_api_key")
	if err != nil {
		return nil, err
	}
	openAIAPIKey.UnmarshalJSONField("value", &settings.OpenAIAPIKey)

	// anthropic enabled
	anthropicEnabled, err := dao.FindFirstRecordByData("settings", "key", "anthropic_enabled")
	if err != nil {
		return nil, err
	}
	anthropicEnabled.UnmarshalJSONField("value", &settings.AnthropicEnabled)

	// anthropic api key
	anthropicAPIKey, err := dao.FindFirstRecordByData("settings", "key", "anthropic_api_key")
	if err != nil {
		return nil, err
	}
	anthropicAPIKey.UnmarshalJSONField("value", &settings.AnthropicAPIKey)

	return settings, nil
}
