# TheServiceMan (Historical Archive)

TheServiceMan is an old Discord.js bot originally used by Minecraft moderation staff to create moderation-session log messages (hours, sanctions, tickets).

This repository is published as a **historical/archival project**. It is not presented as an actively maintained production framework.

## What it does

- Slash command: `/checkin`
- Creates a moderation session embed ("Entrada 1") with:
  - Minecraft username
  - Check-in time
  - Empty check-out time
  - Sanctions/Tickets counters
- Button flow:
  - **CheckOut** → opens a modal to enter sanctions and tickets
  - **New CheckIn** → starts another entry in the same report
  - **EndDay** → closes the report by removing buttons

## Current structure

```text
index.js                    Bot startup, command/event loading
deploy-commands.js          Slash command deployment
config.js                   Environment variable config + validation
DataBase.js                 SQLite connection and legacy users table init
commands/checkin.js         /checkin command
events/interactionCreate.js Buttons/modals/checkout flow
events/ready.js             Ready event
utils/dateFormatter.js      UTC formatting/parsing helpers
.env.example                Safe environment template (no real secrets)
```

## Requirements

- Node.js (recommended: modern LTS)
- npm
- A Discord application + bot token

## Setup from a fresh clone

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create local env file from example and fill values:
   ```bash
   cp .env.example .env
   ```
3. Provide required environment variables:
   - `DISCORD_TOKEN` (**required**)
   - `CLIENT_ID` (**required for deploy**)
   - `DATABASE_URL` (optional, defaults to `./database.sqlite`)
4. Deploy slash commands:
   ```bash
   npm run deploy
   ```
5. Start the bot:
   ```bash
   npm start
   ```

Or run deploy + start in sequence:

```bash
npm run full
```

## Environment variables example

```env
DISCORD_TOKEN=your-discord-bot-token
CLIENT_ID=your-discord-application-client-id
DATABASE_URL=./database.sqlite
```

## Discord setup (high level)

1. Create an application in the Discord Developer Portal.
2. Create/enable a bot user for that application.
3. Copy the bot token into `DISCORD_TOKEN`.
4. Copy the application client ID into `CLIENT_ID`.
5. Invite the bot to your server with the required permissions for slash commands and message interaction.

## Important limitations and security notes

- This is a historical project and may not match modern Discord bot best practices.
- The `users` SQLite table contains **legacy** fields (`username`, `password`, `minecraft_nick`, `discord_id`).
  - These fields are legacy data structure only.
  - Do **not** treat this table as a secure authentication system.
- No real credentials are included in this repository anymore; keep your `.env` private.
- Runtime/local files (`.env`, SQLite database files, local config files) are git-ignored.

### Manual security action still required

If a real bot token was previously committed, you must:

1. **Revoke/regenerate that token** in Discord Developer Portal.
2. If publishing repository history, **scrub the secret from Git history** separately (history rewriting is intentionally not done in this PR).
