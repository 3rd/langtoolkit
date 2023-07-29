package llm

import (
	"context"

	openai "github.com/sashabaranov/go-openai"
)

func CompleteOpenAI(apiKey string, messages []Message, config *map[string]interface{}) (string, error) {
	openAIMessages := make([]openai.ChatCompletionMessage, len(messages))
	for i, message := range messages {
		openAIMessages[i] = openai.ChatCompletionMessage{
			Role:    message.Role,
			Content: message.Text,
		}
	}

	client := openai.NewClient(apiKey)
	res, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model:            openai.GPT3Dot5Turbo,
			Messages:         openAIMessages,
			MaxTokens:        500,
			Stream:           false,
			Temperature:      0.7,
			PresencePenalty:  0.05,
			FrequencyPenalty: 0,
		})

	if err != nil {
		return "", err
	}

	return res.Choices[0].Message.Content, nil
}
