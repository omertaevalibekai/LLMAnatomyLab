# LLM Anatomy Lab

> Interactive behavioral interpretability explorer for large language models.

## Run Locally

1. Install dependencies:

```bash
npm ci
```

2. Create `.env.local` in the project root:

```env
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

3. Start development server:

```bash
npm run dev
```

## Development checks

Use Node.js 22.16+ (CI uses Node 22).

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

Tests and builds do not require an OpenAI key. Configure `.env.local` only for live model requests. Production builds use Webpack explicitly.

## License

MIT — see [LICENSE](LICENSE).
