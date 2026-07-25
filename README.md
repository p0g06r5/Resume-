# Pawan Ghimire Portfolio

React + TypeScript portfolio with a resume-grounded AI recruiter assistant, responsive design, dark mode, accessibility support, automated tests, and GitHub Pages deployment.

## What changed

The previous button-only guided assistant is now a hybrid AI assistant:

- Visitors can type natural-language questions.
- Answers stream into the chat window as they are generated.
- Suggested recruiter questions remain available.
- The system prompt restricts answers to Pawan's portfolio and resume.
- Unrelated questions and prompt-injection attempts are redirected.
- The portfolio remains usable in demo mode before the AI backend is deployed.
- The backend is a small Cloudflare Worker; no database or traditional server is required.

## Project structure

```text
src/components/PortfolioAssistant.tsx  AI chat interface
src/data/assistant.ts                  Suggested questions and demo answers
src/data/portfolio.ts                  Portfolio content
portfolio-ai-worker/                   Cloudflare Worker AI backend
.env.example                           Frontend API URL example
```

## Run the portfolio locally

```bash
npm install
npm run dev
```

Without an API URL, the assistant runs in **demo mode** and uses the existing predefined answers.

## Deploy the free AI backend

A Cloudflare account is required. The implementation uses Cloudflare Workers AI and is intended to stay within Cloudflare's free usage allowance for ordinary personal-portfolio traffic. Free-tier limits can change.

```bash
cd portfolio-ai-worker
npm install
npx wrangler login
npm run deploy
```

After deployment, Wrangler prints a URL similar to:

```text
https://pawan-portfolio-assistant.<your-subdomain>.workers.dev
```

The chat endpoint is:

```text
https://pawan-portfolio-assistant.<your-subdomain>.workers.dev/api/chat
```

### Restrict allowed websites

Open `portfolio-ai-worker/wrangler.jsonc` and update `ALLOWED_ORIGINS` with the exact production portfolio origin. Multiple origins are comma-separated:

```json
"ALLOWED_ORIGINS": "http://localhost:5173,https://p0g06r5.github.io"
```

## Connect the React portfolio to the Worker

Create `.env.local` in the project root:

```env
VITE_ASSISTANT_API_URL=https://pawan-portfolio-assistant.<your-subdomain>.workers.dev/api/chat
```

Restart `npm run dev` after changing environment variables.

For GitHub Pages, add a repository variable:

1. Open **Settings → Secrets and variables → Actions → Variables**.
2. Create `VITE_ASSISTANT_API_URL` with the complete `/api/chat` URL.
3. Ensure the GitHub Actions build exposes that variable to `npm run build`, or place the production URL in a checked-in `.env.production` file because the Worker URL is not a secret.

Never put a private AI-provider API key in a `VITE_*` variable. Vite embeds those values in browser JavaScript. This design needs no provider key because the Worker uses a Cloudflare AI binding.

## Update AI knowledge

The Worker’s controlled resume context is in:

```text
portfolio-ai-worker/src/index.ts
```

Update `portfolioContext` whenever the resume changes. The assistant is instructed not to invent missing facts and not to answer unrelated general questions.

## Quality checks

```bash
npm run check
npx playwright install chromium
npm run test:e2e
```

Worker type check:

```bash
cd portfolio-ai-worker
npm install
npm run typecheck
```

## Deploy the portfolio to GitHub Pages

This project is configured for repository `p0g06r5/Resume-` and uses `/Resume-/` as the production base path.

1. Push the complete project to `main`.
2. In GitHub, open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. The existing deployment workflow deploys automatically.

For a different repository name, update `base` in `vite.config.ts`.

## Portfolio content

- Profile, projects, skills, experience: `src/data/portfolio.ts`
- Suggested assistant prompts and demo answers: `src/data/assistant.ts`
- Resume: `public/Pawan-Ghimire-Resume.pdf`
- Profile image: `public/pawan-ghimire.jpg`
