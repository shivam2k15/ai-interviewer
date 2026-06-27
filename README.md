# Interviewer

An AI interview assistant for structured technical hiring conversations.

## Current architecture

The current implementation connects a chat frontend to a Bun backend that runs an LLM-powered interview workflow through LangGraph.

```text
User
  -> Next.js frontend
  -> Bun API
  -> LangGraph orchestrator
  -> LLM via LangChain + Ollama
  -> Interview response
```

### Main components

- Frontend: Next.js chat experience in frontend/app
- Backend: Bun server in index.ts
- AI flow: src/ai/orchestrator.ts, src/ai/graph.ts, and src/ai/nodes.ts
- Prompt and state handling: src/ai/prompts.ts and src/ai/state.ts
- Session memory: src/ai/session.ts
- API routing: src/routes/index.ts
- Service layer: src/services/index.ts

## Target architecture

The longer-term vision is a full Hiring OS that moves candidates through a complete interview journey and produces a hiring recommendation.

```text
Hiring OS
  -> Resume
  -> AI Screening
  -> Coding Interview
  -> System Design
  -> Behavioral
  -> Scorecard
  -> Hiring Recommendation
  -> Candidate Database
```

## Tech stack

- Bun + TypeScript for the runtime and API server
- Next.js + React for the web UI
- LangChain for LLM integration
- LangGraph for workflow orchestration
- Ollama for local model hosting
- LLMs such as qwen2.5:3b or similar compatible models

## Quick start

1. Install Bun and Ollama.
2. Pull a model locally:

```bash
ollama pull qwen2.5:3b
```

3. Set the environment variables if needed:

```bash
OLLAMA_MODEL=qwen2.5:3b
OLLAMA_BASE_URL=http://localhost:11434
NEXT_PUBLIC_BUN_API_URL=http://localhost:3001
```

4. Install dependencies and run the app:

```bash
bun install
bun run dev
bun run web:dev
```

Open the app at http://localhost:3000 and the backend API at http://localhost:3001.

## Notes

- The current version focuses on interview flow and AI-driven question generation.
- The target version expands this into a complete hiring workflow with scoring, evaluation, and candidate tracking.
