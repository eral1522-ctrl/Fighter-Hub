---
name: Drizzle push interactive prompts
description: How to apply schema changes when `pnpm --filter @workspace/db run push` hangs on rename prompts
---
`drizzle-kit push` prompts interactively ("created or renamed from another table?") when the dev DB has tables not present in the current schema files (e.g. after building on an older git base). The prompt needs a raw TTY — piping newlines or `script -qec` does not get past it in this environment.

**How to apply:** For additive-only changes, run the equivalent DDL directly against the dev DB via `executeSql` (CREATE TABLE IF NOT EXISTS / ADD COLUMN IF NOT EXISTS). Prod schema syncs automatically from the dev DB at Publish time, so no separate prod migration is needed.
