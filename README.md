# Sweet & Salty AI Feedback

Tell the AI what you did today, and get two kinds of feedback back: a Sweet angel that only praises and cheers you on, and a Salty devil that calls out your excuses — plus a concrete 10-minute mission you can start tomorrow.

**Live service:** https://www.sweet-salty-ai.life/

## What I Built During the Contest

During this contest period, I used **Codex** and **GPT-5.6** to fix a bug where the user's custom prompt settings were not being applied, and to add a new feedback intensity control feature.

In more detail:

- **Fixed the personalized-prompt bug.** The client only sent the raw activity text to the API, so the Sweet/Salty modes a user selected on screen never reached the model. Every request produced both personas regardless of what was chosen. The mode selection is now sent to the server and the prompt is assembled conditionally, so unselected personas return an empty result.
- **Added feedback intensity control.** Users can now pick one of three roast levels — Mild, Medium, or Spicy — which is applied to the Salty feedback only. The Sweet feedback stays unconditionally supportive at every level.
- **Added a "10-Minute Mission."** When Salty feedback is enabled, the response includes one concrete action the user can start the next day in under ten minutes.
- **Migrated the backend to the OpenAI Responses API** with strict JSON Schema structured output, replacing brittle text parsing, and added input validation and guardrails that keep criticism aimed at behavior rather than the person.

## Tech Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS 4, lucide-react
- OpenAI Responses API (GPT-5.6 terra medium)
- Deployed on Vercel

## Running Locally

```bash
cd sweet-salty-ai
npm install
echo "OPENAI_API_KEY=your-key-here" > .env
npm run dev
```

Then open http://localhost:3000.
