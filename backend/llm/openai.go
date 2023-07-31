package llm

import (
	"context"
	"errors"
	"io"
	"strings"

	"github.com/pocketbase/pocketbase/daos"
	"github.com/pocketbase/pocketbase/models"
	openai "github.com/sashabaranov/go-openai"
)

var DefaultModel = openai.GPT3Dot5Turbo0613
var DefaultMaxTokens = 0
var DefaultTemperature float32 = 0.7
var DefaultTopP float32 = 1

func ComputeOpenAICompletionConfig(request *CompletionRequest) openai.ChatCompletionRequest {
	config := openai.ChatCompletionRequest{
		Model:       request.Model,
		MaxTokens:   DefaultMaxTokens,
		Temperature: DefaultTemperature,
		TopP:        DefaultTopP,
	}

	if request.Stream != nil {
		config.Stream = *request.Stream
	}

	// params
	if request.Parameters.MaxTokens != nil {
		config.MaxTokens = *request.Parameters.MaxTokens
	}
	if request.Parameters.Temperature != nil {
		config.Temperature = *request.Parameters.Temperature
	}
	if request.Parameters.TopP != nil {
		config.TopP = *request.Parameters.TopP
	}
	if request.Parameters.PresencePenalty != nil {
		config.PresencePenalty = *request.Parameters.PresencePenalty
	}
	if request.Parameters.FrequencyPenalty != nil {
		config.FrequencyPenalty = *request.Parameters.FrequencyPenalty
	}
	if request.Parameters.Stop != nil {
		config.Stop = *request.Parameters.Stop
	}

	return config
}

func CompleteOpenAI(apiKey string, request *CompletionRequest) (*openai.ChatCompletionResponse, error) {
	// transform messages
	openAIMessages := make([]openai.ChatCompletionMessage, len(request.Messages))
	for i, message := range request.Messages {
		openAIMessages[i] = openai.ChatCompletionMessage{
			Role:    message.Role,
			Content: message.Text,
		}
	}

	config := ComputeOpenAICompletionConfig(request)
	config.Messages = openAIMessages

	client := openai.NewClient(apiKey)
	res, err := client.CreateChatCompletion(context.Background(), config)

	if err != nil {
		return nil, err
	}

	return &res, nil
}

func StreamOpenAI(apiKey string, request *CompletionRequest, callback func(openai.ChatCompletionStreamResponse)) error {
	// transform messages
	openAIMessages := make([]openai.ChatCompletionMessage, len(request.Messages))
	for i, message := range request.Messages {
		openAIMessages[i] = openai.ChatCompletionMessage{
			Role:    message.Role,
			Content: message.Text,
		}
	}

	config := ComputeOpenAICompletionConfig(request)
	config.Messages = openAIMessages

	client := openai.NewClient(apiKey)
	stream, err := client.CreateChatCompletionStream(context.Background(), config)
	if err != nil {
		return err
	}
	defer stream.Close()

	for {
		res, err := stream.Recv()
		if errors.Is(err, io.EOF) {
			return nil
		}
		if err != nil {
			return err
		}
		callback(res)
	}
}

func GetOpenAIModels(apiKey string) ([]openai.Model, error) {
	client := openai.NewClient(apiKey)
	res, err := client.ListModels(context.Background())
	if err != nil {
		return nil, err
	}
	return res.Models, nil
}

func UpdateOpenAIModels(dao *daos.Dao, apiKey string) error {
	newModels, err := GetOpenAIModels(apiKey)
	if err != nil {
		return err
	}

	collection, err := dao.FindCollectionByNameOrId("models")
	if err != nil {
		return err
	}

	records, err := dao.FindRecordsByFilter("models", "vendor = 'openai'", "", 100)
	if err != nil {
		return err
	}

	seenRecords := map[string]bool{}
	seenNewModels := map[string]bool{}
	for _, record := range records {
		seenRecords[record.GetString("model")] = true
	}

	for _, model := range newModels {
		if strings.Index(model.ID, "gpt") != 0 {
			continue
		}

		// new model
		if !seenRecords[model.ID] {
			record := models.NewRecord(collection)
			record.Set("vendor", "openai")
			record.Set("model", model.ID)
			record.Set("available", true)
			record.Set("enabled", true)
			record.Set("external_created_at", model.CreatedAt)
			if err := dao.SaveRecord(record); err != nil {
				return err
			}
		}
		seenNewModels[model.ID] = true
	}

	// mark missing models as unavailable
	for _, record := range records {
		if !seenNewModels[record.GetString("model")] {
			record.Set("available", false)
			record.Set("enabled", false)
			if err := dao.SaveRecord(record); err != nil {
				return err
			}
		}
	}

	return errors.New("model not found")
}
