# Deploy Ukrnex to Netlify (Production)

This guide deploys the **Expo web app** and the **Hono API** on a single Netlify site.

- Frontend: static Expo export (`apps/mobile/dist`)
- Backend: Netlify Function (`netlify/functions/api.ts`)
- API routes: `https://your-site.netlify.app/api/v1/...`

---

## 1. Prerequisites

1. Git repository pushed to **GitHub**, **GitLab**, or **Bitbucket**
2. [Netlify account](https://app.netlify.com/signup)
3. [Apibara API key](https://apibara.tech) for live Copart/IAAI lot data

---

## 2. Push code to Git

From the project root:

```bash
git add .
git commit -m "Add Netlify production deployment"
git push origin main
```

> Use your real branch name if it is not `main`.

---

## 3. Create the Netlify site

### Option A — Netlify UI (recommended)

1. Open [https://app.netlify.com](https://app.netlify.com)
2. Click **Add new site** → **Import an existing project**
3. Connect your Git provider and select this repository
4. Netlify should auto-detect settings from `netlify.toml`:

| Setting | Value |
|---------|-------|
| Branch to deploy | `master` |
| Build command | `npm run build:netlify` |
| Publish directory | `apps/mobile/dist` |
| Functions directory | `netlify/functions` |

> If Netlify defaults to `main`, change **Branch to deploy** to `master` in  
> **Site configuration → Build & deploy → Continuous deployment**.

5. Click **Deploy site** (first deploy may fail until env vars are set — that is normal)

### Option B — Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --build --prod
```

---

## 4. Set environment variables (required)

In Netlify: **Site configuration → Environment variables → Add a variable**

Add these for **Production** (and **Deploy previews** if you want previews to work):

| Variable | Example | Purpose |
|----------|---------|---------|
| `EXPO_PUBLIC_API_URL` | `https://ukrnex.netlify.app` | API base URL baked into the web app at build time |
| `APIBARA_API_KEY` | `ak_live_...` | Apibara key used by the serverless API |

### Important

- `EXPO_PUBLIC_API_URL` must be your **public site URL** (no trailing slash).
- After the first deploy, copy the Netlify URL (e.g. `https://random-name-123.netlify.app`) and set `EXPO_PUBLIC_API_URL` to that exact URL.
- If you add a custom domain later, update `EXPO_PUBLIC_API_URL` and **trigger a new deploy**.

---

## 5. Redeploy after env vars

1. Go to **Deploys**
2. Click **Trigger deploy** → **Deploy site**

The build will:

1. Install dependencies (`npm ci`)
2. Export the Expo web app with your production API URL
3. Bundle the API as a Netlify Function

---

## 6. Verify production

Replace `YOUR_SITE` with your Netlify URL.

**API health**

```bash
curl https://YOUR_SITE.netlify.app/health
```

Expected:

```json
{"status":"ok","service":"ukrnex-api"}
```

**Analyze endpoint**

```bash
curl -X POST https://YOUR_SITE.netlify.app/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"https://www.copart.com/lot/53848476\"}"
```

**Web app**

Open `https://YOUR_SITE.netlify.app` in the browser and test:

- Paste a Copart/IAAI lot URL on **Оцінка**
- Open **Профіль** via the settings icon
- Check **Історія** and lot details navigation

---

## 7. Custom domain (optional)

1. Netlify → **Domain management** → **Add a domain**
2. Follow DNS instructions from Netlify
3. Update `EXPO_PUBLIC_API_URL` to `https://your-domain.com`
4. Redeploy the site

---

## 8. Local production build test

Test the same build Netlify runs:

```bash
# From repo root
set EXPO_PUBLIC_API_URL=http://localhost:3001
npm run build:netlify
```

On macOS/Linux:

```bash
EXPO_PUBLIC_API_URL=http://localhost:3001 npm run build:netlify
```

Serve the static output locally:

```bash
npx serve apps/mobile/dist
```

---

## 9. Troubleshooting

| Problem | Fix |
|---------|-----|
| `Сервер недоступний` in the app | Set `EXPO_PUBLIC_API_URL` to your Netlify URL and redeploy |
| `APIBARA_API_KEY` errors | Add the key in Netlify env vars (Functions scope) |
| 404 on `/api/...` | Confirm `netlify.toml` redirects exist and function deployed |
| Old API URL after change | Redeploy — `EXPO_PUBLIC_API_URL` is embedded at **build** time |
| Build fails on `expo export` | Use Node 20 (set in `netlify.toml`) |

---

## 10. Project layout (deployment-related)

```
netlify.toml                 # Netlify build + redirects
netlify/functions/api.ts     # Serverless API entry
apps/mobile/app.config.ts    # Reads EXPO_PUBLIC_API_URL
apps/mobile/dist/            # Generated web build (not committed)
apps/api/src/app.ts          # Shared Hono app (local + Netlify)
```

---

## Security notes

- Never commit `APIBARA_API_KEY` or `apps/api/.env` to Git
- Keep `.env` files local only
- Rotate the Apibara key if it was ever exposed
