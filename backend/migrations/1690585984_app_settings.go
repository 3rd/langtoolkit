package migrations

import (
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db)

		settings, _ := dao.FindSettings()
		settings.Meta.AppName = "LangToolkit"
		// settings.Smtp.Enabled = false

		if err := dao.SaveSettings(settings); err != nil {
			return err
		}

		return nil
	}, func(db dbx.Builder) error {
		return nil
	})
}
