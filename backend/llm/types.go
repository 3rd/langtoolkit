package llm

type Message struct {
	Role string `json:"role"`
	Text string `json:"text"`
}

type CompletionRequest struct {
	Vendor   string                  `json:"vendor"` // "openai" | "anthropic" | "custom"
	Model    string                  `json:"model"`
	Messages []Message               `json:"messages"`
	Config   *map[string]interface{} `json:"config"`
	Stream   *bool                   `json:"stream"`
}

type CompletionResponse struct {
	Text string `json:"text"`
}
