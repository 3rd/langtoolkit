package api

import (
	"log"
	"main/llm"
	"time"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/daos"
	"github.com/pocketbase/pocketbase/models"
)

func Complete(dao *daos.Dao) echo.HandlerFunc {
	return func(c echo.Context) error {
		request := new(llm.CompletionRequest)
		if err := c.Bind(request); err != nil {
			return err
		}

		user, _ := c.Get(apis.ContextAuthRecordKey).(*models.Record)
		settings, err := GetSettings(dao)
		if err != nil {
			return err
		}

		// create completion record
		completionsCollection, err := dao.FindCollectionByNameOrId("completions")
		if err != nil {
			return err
		}
		record := models.NewRecord(completionsCollection)
		record.Set("user", user.Id)
		record.Set("source", "playground")
		record.Set("status", "pending")
		record.Set("consumed_at", time.Now())
		record.Set("vendor", request.Vendor)
		record.Set("model", request.Model)
		record.Set("input", request.Messages)
		record.Set("parameters", request.Parameters)
		if err := dao.SaveRecord(record); err != nil {
			return err
		}

		// OpenAI
		if request.Vendor == "openai" {
			// compute config
			config := llm.ComputeOpenAICompletionConfig(request)
			record.Set("parameters", config)

			// bail if OpenAI is not enabled
			if !settings.OpenAIEnabled {
				record.Set("status", "error")
				record.Set("error", "OpenAI is not enabled")
				record.Set("resolved_at", time.Now())
				if err := dao.SaveRecord(record); err != nil {
					return err
				}

				return c.JSON(400, &echo.Map{
					"id":    record.Get("id").(string),
					"error": "OpenAI is not enabled",
				})
			}

			// request completion from OpenAI
			resp, err := llm.CompleteOpenAI(settings.OpenAIAPIKey, request)

			// fail
			if err != nil {
				record.Set("status", "error")
				record.Set("error", err.Error())
				record.Set("resolved_at", time.Now())
				if err := dao.SaveRecord(record); err != nil {
					return err
				}
				return c.JSON(500, &echo.Map{
					"id":    record.Get("id").(string),
					"error": err.Error(),
				})
			}

			// success
			record.Set("status", "success")
			record.Set("response", resp)
			record.Set("resolved_at", time.Now())
			if err := dao.SaveRecord(record); err != nil {
				return err
			}
			return c.JSON(200, llm.CompletionResponse{
				ID:   record.Get("id").(string),
				Text: resp.Choices[0].Message.Content,
			})
		}

		log.Println("record", record.Get("id"))
		resp := llm.CompletionResponse{
			Text: "Hello, World!",
		}

		return c.JSON(200, resp)
	}
}
