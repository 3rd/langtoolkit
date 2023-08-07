package llm

import openai "github.com/sashabaranov/go-openai"

type Message struct {
	Role string `json:"role"`
	Text string `json:"text"`
}

type CompletionParameters struct {
	MaxTokens        *int                         `json:"max_tokens,omitempty"`
	Temperature      *float32                     `json:"temperature,omitempty"`
	TopP             *float32                     `json:"top_p,omitempty"`
	N                *int                         `json:"n,omitempty"`
	Stream           *bool                        `json:"stream,omitempty"`
	Stop             *[]string                    `json:"stop,omitempty"`
	PresencePenalty  *float32                     `json:"presence_penalty,omitempty"`
	FrequencyPenalty *float32                     `json:"frequency_penalty,omitempty"`
	LogitBias        *map[string]int              `json:"logit_bias,omitempty"`
	UserToken        *string                      `json:"user_token,omitempty"`
	Functions        *[]openai.FunctionDefinition `json:"functions,omitempty"`
	FunctionCall     *any                         `json:"function_call,omitempty"`
}

type CompletionRequest struct {
	Vendor     string               `json:"vendor"` // string | "custom"
	Model      string               `json:"model"`
	Messages   []Message            `json:"messages"`
	Parameters CompletionParameters `json:"parameters"`
	Stream     *bool                `json:"stream"`
}

type CompletionResponse struct {
	ID             string  `json:"id"`
	ElapsedSeconds float64 `json:"elapsedSeconds"`
	Text           string  `json:"text"`
}
