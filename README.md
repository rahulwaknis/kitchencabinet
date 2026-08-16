# Kitchen Cabinet

Kitchen Cabinet is a no-login agentic AI recipe demonstrator where users enter ingredients, choose cooking agents, and watch the cabinet debate recipe recommendations.

## Features

- Single-session recipe recommendations with no accounts and no saved data.
- Five available cooking agents: Protein, Nutrition, Fusion, Time, and Taste.
- Users can select up to three agents for each temporary cabinet.
- Concise and verbose debate modes.
- Server-side OpenAI API route with JSON responses.
- Basic input validation, output token caps, and lightweight rate limiting.

## Tech Stack

- Next.js 13 pages router
- React 18
- TypeScript
- Tailwind CSS
- OpenAI Chat Completions API through a server-side API route

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the example environment file:

```bash
copy .env.example .env.local
```

On macOS/Linux:

```bash
cp .env.example .env.local
```

3. Add your OpenAI API key to `.env.local`.

4. Optionally set `OPENAI_MODEL`. If omitted, the app uses the default model configured in the API route.

5. Run the dev server:

```bash
npm run dev
```

If PowerShell blocks npm scripts, use:

```bash
npm.cmd run dev
```

6. Open:

```text
http://localhost:3000
```

## Environment Variables

Create `.env.local` for local development and add these values as Vercel project environment variables for deployment:

```env
OPENAI_API_KEY=
OPENAI_MODEL=
MAX_INGREDIENT_INPUT_CHARS=1000
MAX_SELECTED_AGENTS=3
APP_RATE_LIMIT_WINDOW_MS=60000
APP_RATE_LIMIT_MAX_REQUESTS=5
```

- `OPENAI_API_KEY`: Required server-side OpenAI API key.
- `OPENAI_MODEL`: Optional model override. Leave blank to use the app default.
- `MAX_INGREDIENT_INPUT_CHARS`: Maximum ingredient input length.
- `MAX_SELECTED_AGENTS`: Maximum number of selected agents.
- `APP_RATE_LIMIT_WINDOW_MS`: In-memory rate-limit window.
- `APP_RATE_LIMIT_MAX_REQUESTS`: Maximum requests per rate-limit window.

## Running Locally

```bash
npm run dev
```

Then test both modes:

- Concise mode with a short ingredient list.
- Verbose mode with the same ingredient list.

## Deploying To Vercel

1. Push the repo to GitHub.
2. Import the GitHub repo into Vercel.
3. In Vercel Project Settings, add:

```text
OPENAI_API_KEY
OPENAI_MODEL
MAX_INGREDIENT_INPUT_CHARS
MAX_SELECTED_AGENTS
APP_RATE_LIMIT_WINDOW_MS
APP_RATE_LIMIT_MAX_REQUESTS
```

4. Deploy.
5. Test concise and verbose modes on the live URL.

## GitHub Push Instructions

If this local project is not already a Git repository:

```bash
git init
git add .
git commit -m "Prepare Kitchen Cabinet for deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

If the repo is already initialized, do not run `git init` again. Instead check:

```bash
git status
git remote -v
```

Then commit and push to the existing remote.

## Security Notes

- Never commit `.env.local`.
- Never expose the OpenAI API key using `NEXT_PUBLIC`.
- OpenAI calls must stay server-side in API routes.
- Use prepaid billing or a low budget for hobby demos.
- This app does not store user inputs, generated recipes, or selected agents.

## Cost Notes

- Hosting can start on Vercel Hobby.
- OpenAI API usage is separate pay-as-you-go or prepaid billing.
- Verbose debate mode costs more than concise mode.
- Keep output token caps and rate limits in place.

## Project Constraints

- No login.
- No database.
- No saving.
- No saved agents or recipes; every cabinet is a single session.
- No weekly meal planning.
- No image upload.
- No pantry tracking.

## Secret Scanning Reminder

Before pushing, manually search the project for:

- `OPENAI_API_KEY`
- `sk-`
- `.env.local` contents

Also check:

```bash
git status
```

Do not add the real key anywhere in committed files.

## Testing Checklist

- Run `npm run build`.
- Run `npm run lint` if ESLint is configured.
- Test the API locally.
- Test concise mode.
- Test verbose mode.
- Confirm `.env.local` is ignored.
- Confirm the OpenAI API key is not visible in browser dev tools.
