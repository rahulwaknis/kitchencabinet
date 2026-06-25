# Deployment Checklist

## Before Pushing To GitHub

- Confirm `.env.local` is ignored.
- Confirm no real API key appears in code.
- Run a project search for `sk-` or secret-like strings.
- Run a project search for `OPENAI_API_KEY`.
- Run a project search for `.env.local` contents.
- Run build.
- Run lint if available.
- Test API locally.
- Test concise mode.
- Test verbose mode.
- Test rate limiting if practical.

## GitHub

- Create a new repository.
- Push code.
- Keep repo private initially if desired.
- Do not commit `.env.local`.

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

## Vercel

- Import GitHub repo.
- Add environment variables:
  - `OPENAI_API_KEY`
  - `OPENAI_MODEL`
  - `MAX_INGREDIENT_INPUT_CHARS`
  - `MAX_SELECTED_AGENTS`
  - `APP_RATE_LIMIT_WINDOW_MS`
  - `APP_RATE_LIMIT_MAX_REQUESTS`
- Deploy.
- Test live URL.
- Check Vercel function logs if API fails.

## After Going Live

- Test with sample ingredients.
- Confirm API key is not visible in browser dev tools.
- Confirm no user data is stored.
- Monitor OpenAI usage.
- Set prepaid billing or budget alerts.
