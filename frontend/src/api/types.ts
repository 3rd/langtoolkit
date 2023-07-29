/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Settings = "settings",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type SettingsRecord<Tvalue = unknown> = {
	key: string
	value?: null | Tvalue
}

export enum UsersRoleOptions {
	"admin" = "admin",
	"user" = "user",
}
export type UsersRecord = {
	name: string
	avatar?: string
	role?: UsersRoleOptions
}

// Response types include system fields and match responses from the PocketBase API
export type SettingsResponse<Tvalue = unknown, Texpand = unknown> = Required<SettingsRecord<Tvalue>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	settings: SettingsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	settings: SettingsResponse
	users: UsersResponse
}