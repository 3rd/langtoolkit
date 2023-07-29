package llm

type Message struct {
	Role string `json:"role"`
	Text string `json:"text"`
}

// maxTokens?: number;
// temperature?: number;
// topP?: number;
// presencePenalty?: number;
// frequencyPenalty?: number;
// stopSequences?: string[];
type CompletionParameters struct {
	MaxTokens        *int      `json:"maxTokens,omitempty"`
	Temperature      *float32  `json:"temperature,omitempty"`
	TopP             *float32  `json:"topP,omitempty"`
	PresencePenalty  *float32  `json:"presencePenalty,omitempty"`
	FrequencyPenalty *float32  `json:"frequencyPenalty,omitempty"`
	Stop             *[]string `json:"stop,omitempty"`
}

type CompletionRequest struct {
	Vendor     string               `json:"vendor"` // string | "custom"
	Model      string               `json:"model"`
	Messages   []Message            `json:"messages"`
	Parameters CompletionParameters `json:"parameters"`
	Stream     *bool                `json:"stream"`
}

type CompletionResponse struct {
	ID   string `json:"id"`
	Text string `json:"text"`
}
