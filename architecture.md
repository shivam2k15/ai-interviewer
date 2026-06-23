# Architecture Guide

This document defines the intended structure for this POC so the code stays easy to extend, test, and reason about.

The main idea is simple:

- `AI` handles model prompting and graph reasoning
- `services` hold business logic
- `apis` expose HTTP or command interfaces
- `middleware` handles cross-cutting concerns
- `backend` coordinates everything and keeps the app entry points thin

This is a boundary document first, not a full implementation. It is meant to guide future code changes in TypeScript.

## Goals

- Keep responsibilities separated
- Make the flow easy for a beginner to follow
- Avoid putting business logic inside route handlers or AI nodes
- Make LangGraph a workflow layer, not a place for unrelated app logic
- Keep the code testable by isolating pure functions where possible

## Suggested Layering

Use these layers from top to bottom:

1. `apis`
2. `middleware`
3. `backend`
4. `services`
5. `ai`
6. `infrastructure`

### 1. APIs

`apis` are the external entry points.

Examples:

- REST routes
- CLI commands
- future websocket handlers

Responsibilities:

- receive input
- validate request shape
- call backend orchestration
- return a response

Rules:

- Do not place business logic here
- Do not call Ollama or LangGraph directly from routes
- Keep handlers small and predictable

### 2. Middleware

`middleware` contains reusable request or execution wrappers.

Examples:

- auth checks
- logging
- rate limiting
- request validation
- error formatting
- tracing

Responsibilities:

- handle cross-cutting concerns
- stay reusable across APIs

Rules:

- Middleware should not know domain-specific logic
- Middleware should not contain AI prompts
- Middleware should not directly mutate service state unless that is its explicit job

### 3. Backend

`backend` is the orchestration layer.

This is where the app decides what happens in what order.

Responsibilities:

- coordinate APIs, services, and AI
- build end-to-end use cases
- map input into service calls
- merge results into output DTOs

Rules:

- Keep backend functions focused on flow, not deep business rules
- Backend should call services instead of implementing them
- Backend should not know internal prompt templates unless they are part of the orchestration contract

### 4. Services

`services` contain business logic.

Examples:

- conversation service
- interview session service
- prompt assembly service
- user profile service
- memory/session service
- response post-processing service

Responsibilities:

- implement the real app rules
- normalize and transform data
- produce reusable domain behavior

Rules:

- Services should be framework-agnostic where possible
- Services should not depend on HTTP specifics
- Services should not directly manage UI concerns
- Services should not contain route definitions

### 5. AI

`ai` contains model-specific code and LangGraph workflows.

Examples:

- `ChatOllama` setup
- model wrappers
- prompt templates
- LangGraph state definitions
- node functions
- tool routing logic

Responsibilities:

- interact with the LLM
- define graph states and nodes
- keep model usage isolated from business services

Rules:

- AI code should not become a dumping ground for app logic
- AI nodes should receive prepared inputs from services/backend
- AI code should return structured outputs whenever possible
- Prompt templates should be versioned or at least kept in one place

### 6. Infrastructure

`infrastructure` contains external system integrations.

Examples:

- Ollama client setup
- database clients
- file storage clients
- email clients
- third-party API adapters

Responsibilities:

- connect to external systems
- provide low-level adapters to the rest of the app

Rules:

- Keep vendor-specific code isolated here
- Wrap external SDKs behind your own interfaces when possible

## Recommended Folder Layout

For a future TypeScript version of this POC, a clean structure could look like:

```txt
src/
  api/
    http/
      routes.ts
      handlers.ts
    cli/
      commands.ts
  backend/
    interviewOrchestrator.ts
  middleware/
    auth.ts
    logger.ts
    errorHandler.ts
    validateRequest.ts
  services/
    interviewService.ts
    promptService.ts
    memoryService.ts
    responseService.ts
  ai/
    ollamaClient.ts
    graph/
      interviewGraph.ts
      state.ts
      nodes/
        chatNode.ts
        judgeNode.ts
        routeNode.ts
    prompts/
      interviewPrompt.ts
  infrastructure/
    config/
      env.ts
    adapters/
      ollamaAdapter.ts
      storageAdapter.ts
  types/
    dto.ts
    domain.ts
    graph.ts
  index.ts
```

## Responsibility Boundaries

### API Boundary

An API handler should:

- parse input
- validate input
- call backend orchestration
- return response

It should not:

- create prompt templates
- call database logic directly
- contain LangGraph node logic

### Middleware Boundary

A middleware function should:

- wrap requests or execution
- enforce shared concerns
- standardize failures

It should not:

- decide business outcomes
- run AI generation
- own persistence logic

### Backend Boundary

A backend orchestration function should:

- decide which service to call
- control the order of operations
- connect validation, AI, and storage when needed

It should not:

- do heavy model prompting itself
- duplicate service logic
- expose transport-specific concerns

### Service Boundary

A service should:

- be focused on one business capability
- accept plain inputs
- return plain outputs

It should not:

- know whether it was called from HTTP, CLI, or tests
- depend on a specific framework unless necessary

### AI Boundary

An AI module should:

- prepare prompts
- manage graph state
- call the model
- transform raw model output into structured results

It should not:

- contain unrelated business rules
- depend on route handlers
- know how the frontend renders data

## How The Current POC Fits

Right now, the project is intentionally small and the logic lives in `index.ts`.

As this grows, the current file should be split like this:

- `index.ts` becomes the entry point
- `ai/ollamaClient.ts` creates the Ollama model
- `ai/graph/interviewGraph.ts` owns the LangGraph flow
- `services/` prepares the business input for the graph
- `backend/` coordinates the use case
- `apis/` exposes the interaction to a user or client

## Data Flow

Recommended flow:

1. API receives request
2. Middleware validates and enriches request
3. Backend selects the use case
4. Services prepare business data
5. AI layer runs LangGraph and Ollama
6. Services normalize the output
7. API returns the response

## Suggested Coding Rules

- Use `PascalCase` for classes and types
- Use `camelCase` for functions, variables, and files where appropriate
- Keep each file focused on one responsibility
- Prefer named exports for shared modules
- Keep prompt text near the AI layer
- Keep input/output types in a `types/` folder or alongside the module if they are local-only

## Error Handling

Recommended pattern:

- Middleware catches transport-level errors
- Backend catches orchestration failures
- Services throw domain-friendly errors
- AI layer wraps external provider errors with context

Avoid:

- swallowing errors silently
- returning raw provider errors directly to clients
- mixing user-facing messages with low-level stack traces

## Testing Strategy

Test in this order:

1. Pure service functions
2. Backend orchestration
3. AI node behavior with mocked model calls
4. API handlers
5. Middleware behavior

This keeps tests fast and makes failures easier to understand.

## What To Keep Stable

These boundaries should remain stable as the project grows:

- transport logic stays in `apis`
- shared request concerns stay in `middleware`
- orchestration stays in `backend`
- business logic stays in `services`
- model and graph logic stays in `ai`
- third-party clients stay in `infrastructure`

If code starts crossing those lines too often, it is usually a signal to split the module.

