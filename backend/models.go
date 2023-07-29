package main

import (
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/tools/types"
)

type Completion struct {
	models.BaseModel

	Vendor     string          `db:"vendor" json:"vendor"`
	Model      string          `db:"model" json:"model"`
	Input      types.JsonRaw   `db:"input" json:"input"`
	Status     string          `db:"status" json:"status"`
	User       *models.Record  `db:"user" json:"user"`
	Source     string          `db:"source" json:"source"`
	Parameters types.JsonRaw   `db:"parameters" json:"parameters"`
	Response   types.JsonRaw   `db:"response" json:"response"`
	Error      string          `db:"error" json:"error"`
	ConsumedAt *types.DateTime `db:"consumedAt" json:"consumedAt"`
}
