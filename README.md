## What I Built

A prototype for a Bodybuilding and Fitness App that makes use of Generative AI to answer user queries and give fitness tips.

- Basic Authentication using Supabase GoogleAuth - Implicit type for faster development
- Vanilla OpenAI API (GPT4o-mini model) to answer fitness tips.
- Prompt template is a very simple one-liner.
- Protein Factory Logic problem (Not yet started)

## What I learnt

- Basics of Next.js - Server / Client components, what is SSR, cool in-built App Router
- How to make use of Supabase's open-source tools, in this case Google Auth.
- Refresher on JWT, and how Social Auth works in general
- How to work with OpenAI APIs, no frameworks yet. Just plain API.

## Things I would improve

- Maybe after a deep dive into how SSR works, try rendering as many components as possible in the server. Currently did not make much use of this.
- Set up some extra context for the LLM, pass in some additional user specific info taken during sign up and give it as a system prompt.
- Improve the authentication flow. Move into PKCE server-side auth instead.
- Look into improving response from LLM, use Agentic frameworks to attach tools, and possibly set up multi-agent architecture ( Although for this use-case it might be overkill) - Maybe take set up different Agents for Nutritionist and Fitness tips.
