/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Completions = "completions",
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

export enum CompletionsStatusOptions {
	"pending" = "pending",
	"success" = "success",
	"error" = "error",
}

export enum CompletionsSourceOptions {
	"playground" = "playground",
	"app" = "app",
	"api" = "api",
}
export type CompletionsRecord<Tinput = unknown, Tparameters = unknown, Tresponse = unknown> = {
	vendor: string
	model: string
	input: null | Tinput
	status: CompletionsStatusOptions
	user: RecordIdString
	source: CompletionsSourceOptions
	parameters?: null | Tparameters
	response?: null | Tresponse
	output?: string
	error?: string
	consumed_at?: IsoDateString
	resolved_at?: IsoDateString
}

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
export type CompletionsResponse<Tinput = unknown, Tparameters = unknown, Tresponse = unknown, Texpand = unknown> = Required<CompletionsRecord<Tinput, Tparameters, Tresponse>> & BaseSystemFields<Texpand>
export type SettingsResponse<Tvalue = unknown, Texpand = unknown> = Required<SettingsRecord<Tvalue>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	completions: CompletionsRecord
	settings: SettingsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	completions: CompletionsResponse
	settings: SettingsResponse
	users: UsersResponse
}