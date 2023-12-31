package main

import (
	"log"
	"main/api"
	"main/llm"

	_ "main/migrations"
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

func main() {
	app := pocketbase.New()

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: true,
	})

	// add routes
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.AddRoute(echo.Route{
			Method:  http.MethodPost,
			Path:    "/complete",
			Handler: api.Complete(e.App.Dao()),
			Middlewares: []echo.MiddlewareFunc{
				apis.ActivityLogger(e.App),
				apis.RequireRecordAuth("users"),
			},
		})
		return nil
	})

	// hooks
	app.OnRecordAfterUpdateRequest("settings").Add(func(e *core.RecordUpdateEvent) error {
		key := e.Record.Get("key")

		// update OpenAI models
		if key == "openai_api_key" {
			apiKey := ""
			e.Record.UnmarshalJSONField("value", &apiKey)
			if apiKey != "" {
				llm.UpdateOpenAIModels(app.Dao(), apiKey)
			}
		}

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
