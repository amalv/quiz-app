# Docusaurus Quiz App

Turn documentation pages into interactive quizzes. Paste a docs URL, the app fetches the content and generates multiple‑choice questions using Groq.

## Features

- Fetch content from any public docs URL
- Create 5 multiple‑choice questions with explanations
- Take the quiz in‑app with progress and scoring

## Prerequisites

- Node.js 18+ (Bun or pnpm/npm/yarn supported)
- A Groq API key

## Setup

1) Create an environment file

Copy the example and add your key:

```bash
cp .env.example .env.local
```

Then set:

```
GROQ_API_KEY=your_groq_key
```

2) Install dependencies

```bash
bun install
```

3) Run the app

```bash
bun run dev
```

Open http://localhost:3000 and paste a docs URL.

## Using Groq via cURL (example)

Here’s a minimal cURL sample that mirrors what the app does server‑side. Replace YOUR_KEY:

```bash
curl -s https://api.groq.com/openai/v1/chat/completions \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer YOUR_KEY" \
	-d '{
		"model": "meta-llama/llama-4-scout-17b-16e-instruct",
		"messages": [
			{"role":"system","content":"You create JSON multiple-choice quizzes."},
			{"role":"user","content":"Generate 5 MCQs about Docusaurus intro. JSON only."}
		]
	}'
```

The app reads `GROQ_API_KEY` at runtime and calls Groq in `app/api/generate-quiz/route.ts`.

## Project Structure

- `app/api/fetch-content/route.ts` – Fetch and sanitize webpage content
- `app/api/generate-quiz/route.ts` – Turn content into quiz JSON via xAI Grok
- `app/page.tsx` – UI to enter URL, preview questions, and start the quiz

## Deployment

This project is platform‑agnostic. Deploy anywhere that supports Next.js (Node server, Docker, or serverless). Ensure `XAI_API_KEY` is set in the runtime environment.

## License

MIT
