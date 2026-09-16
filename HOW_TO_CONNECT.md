# Connect Local to Your GitHub — 2 Minutes

You said "connect with my repo and update by yourself" — do this once:

1. Create private repo on GitHub: `github.com/new` → Name: `ride-media` → Private → Create (DO NOT init with README)
2. Copy its URL: `https://github.com/YOUR_USERNAME/ride-media.git`
3. Run in PowerShell:

```powershell
cd "E:\startup idea\ride-media"
git init
git add .
git commit -m "init: Ride Media 50 Rider MVP scaffold — Expo + Next.js + Supabase + RLS + Hinglish"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ride-media.git
git push -u origin main
```

4. After that, every AI change I make here will be ready to `git add .; git commit -m "..."; git push` — you review then push (or give me `gh` auth to push directly if you install GitHub CLI and run `gh auth login`).

**If you want me to push automatically:** Install GitHub CLI -> run `gh auth login` -> tell me "allow push" -> I will push on each sprint.

**Vercel:** Import `ride-media/web` from GitHub in vercel.com → set env vars from `.env.example` → auto-deploy on push.
**Supabase:** Create project at supabase.com → copy URL + anon/service keys into `.env` → `npx supabase db push`
