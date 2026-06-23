# Interviewer

A minimal full-stack AI demo built with:

- Bun
- TypeScript
- LangChain
- LangGraph
- Ollama
- Next.js
- React

The backend runs a local Ollama model through a small LangGraph flow.
The frontend provides a simple chat UI with an input box, send button, and a Q&A list.

## Architecture

- Frontend: Next.js app in [`frontend/`](./frontend)
- Backend: Bun HTTP server in [`index.ts`](./index.ts)
- AI service: LangChain + LangGraph in [`src/ai/index.ts`](./src/ai/index.ts)
- Route handling: [`src/routes/index.ts`](./src/routes/index.ts)
- Request/response service: [`src/services/index.ts`](./src/services/index.ts)

### Ports

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001`

The frontend calls the backend API at:

- `POST http://localhost:3001/api/chat`

## Features

- Simple chat UI
- Local Ollama model invocation
- CORS enabled for local frontend access
- Watch mode for backend development
- Production-style README and GitHub-ready setup

## Requirements

Install these first:

- Bun
- Node.js 18+ recommended for the Next.js frontend
- Ollama installed and running locally

Make sure your Ollama model is available:

```bash
ollama pull qwen2.5:3b
```

You can also switch models with `OLLAMA_MODEL`, which defaults to `qwen2.5:3b` in this project.

## Install

Install dependencies for the backend/root project:

```bash
bun install
```

The frontend uses the same workspace dependencies, so no separate install is required unless you want to manage it independently.

## Run

Start the backend in watch mode:

```bash
bun run dev
```

Start the frontend in a separate terminal:

```bash
bun run web:dev
```

Open:

```text
http://localhost:3000
```

## Environment Variables

Backend:

- `OLLAMA_MODEL` - Ollama model name, defaults to `qwen2.5:3b`
- `OLLAMA_BASE_URL` - Ollama server URL, defaults to `http://localhost:11434`

Frontend:

- `NEXT_PUBLIC_BUN_API_URL` - Backend API URL, defaults to `http://localhost:3001`

Example:

```bash
OLLAMA_MODEL=qwen2.5:3b OLLAMA_BASE_URL=http://localhost:11434 bun run dev
```

```bash
NEXT_PUBLIC_BUN_API_URL=http://localhost:3001 bun run web:dev
```

## How It Works

1. The frontend sends a `POST` request with `{ message: string }`.
2. The Bun backend validates the request.
3. The backend passes the prompt to the LangGraph flow.
4. `ChatOllama` sends the prompt to Ollama.
5. The final answer is returned as JSON.
6. The frontend appends the answer to the Q&A list.

## Backend Flow

### 1. Ollama Model

[`src/ai/index.ts`](./src/ai/index.ts)

```ts
const model = new ChatOllama({
  model: process.env.OLLAMA_MODEL,
  temperature: 0,
  baseUrl: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
  keepAlive: "30m",
  think: false,
  numPredict: 8,
});
```

This keeps the model loaded for 30 minutes and limits extra reasoning/output for faster short responses.

### 2. Graph State

[`src/ai/index.ts`](./src/ai/index.ts)

The graph stores a message list and appends each response to the state.

### 3. Route Handling

[`src/routes/index.ts`](./src/routes/index.ts)

This file:

- accepts `POST /api/chat`
- handles CORS preflight `OPTIONS /api/chat`
- returns JSON for success and error responses

### 4. AI Response Service

[`src/services/index.ts`](./src/services/index.ts)

This file converts a prompt into a JSON response:

- input: prompt string
- output: `{"answer":"..."}` response

## Frontend Flow

[`frontend/app/page.tsx`](./frontend/app/page.tsx)

The page:

- accepts user input
- sends the message through [`frontend/app/service.ts`](./frontend/app/service.ts)
- renders the conversation below the form

## Production Notes

This project is ready to upload to GitHub as a clean demo repository.

Recommended before publishing:

- remove any leftover debug `console.log` statements
- make sure your `.gitignore` excludes build output and local env files
- keep secrets out of the repository
- pin a stable Ollama model in the README or `.env.example`, such as `qwen2.5:3b`

## GitHub Setup

If this repo is not already connected to GitHub, use:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

If the repository is already on GitHub, just push your latest changes:

```bash
git add .
git commit -m "Update backend and frontend docs"
git push
```

## Suggested Folder Layout

```text
.
├─ index.ts
├─ src/
│  ├─ ai/
│  ├─ routes/
│  └─ services/
└─ frontend/
   ├─ app/
   ├─ next.config.mjs
   └─ package.json
```

## Troubleshooting

### 404 from the frontend

The frontend must call the Bun backend on `http://localhost:3001`.

### Model is slow

- Use a smaller model
- Keep Ollama running
- Keep `keepAlive: "30m"`
- Keep `numPredict` low for short answers

### Backend does not respond

- Check that Ollama is running
- Check `OLLAMA_BASE_URL`
- Check that the model exists in Ollama

## License

Add your preferred license before publishing to GitHub.
