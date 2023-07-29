package api

import (
	"log"
	"main/llm"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase/daos"
)

func Complete(dao *daos.Dao) echo.HandlerFunc {
	return func(c echo.Context) error {
		// record, _ := c.Get(apis.ContextAuthRecordKey).(*models.Record)
		// log.Printf("record: %+v", record)

		req := new(llm.CompletionRequest)
		if err := c.Bind(req); err != nil {
			return err
		}

		settings, err := GetSettings(dao)
		if err != nil {
			return err
		}
		log.Printf("settings: %+v", settings)

		// OpenAI
		if req.Vendor == "openai" {
			if !settings.OpenAIEnabled {
				return c.JSON(400, &echo.Map{
					"error": "OpenAI is not enabled",
				})
			}
			resp, err := llm.CompleteOpenAI(settings.OpenAIAPIKey, req.Messages, req.Config)
			if err != nil {
				return c.JSON(500, &echo.Map{
					"error": err.Error(),
				})
			}
			return c.JSON(200, llm.CompletionResponse{
				Text: resp,
			})
		}

		resp := llm.CompletionResponse{
			Text: "Hello, World!",
		}

		return c.JSON(200, resp)
	}
}
