# Ride Media — 50 Rider MVP

> 1 Rider Android App (Expo) + 1 Website (Landing + Admin, Next.js) + Supabase backend. GitHub is center.

**Quick start (after cloning):**
```bash
# 1. Backend
cp .env.example .env  # fill SUPABASE_URL/KEYS
npx supabase db push  # applies supabase/schema.sql + RLS

# 2. Rider App (OnePlus 11)
cd rider-app
npm install
npx expo start  # scan QR on OnePlus 11, or: npx expo run:android -> APK

# 3. Web (Landing + Admin)
cd web
npm install
npm run dev  # http://localhost:3000  (/brands = lead form)
```

**Deploy (free):**
*   Web → Vercel: `vercel --prod` (connect GitHub repo, set env vars in Vercel dashboard)
*   App → APK via WhatsApp: `eas build -p android --profile preview`
*   Backend → Supabase already hosted

**Structure:**
```
ride-media/
 ├─ rider-app/   # Expo, Hinglish, GPS foreground, selfie
 ├─ web/         # Next.js, /brands lead form + /admin
 ├─ supabase/    # schema.sql, RLS, storage, functions
 ├─ .env.example
 └─ BUILD_LOG.md -> E:\startup idea\BUILD_LOG.md
```

**Security:** See `E:\startup idea\SECURITY_CHECKLIST.md` — 12 checks, RLS on every table, gitleaks CI.

**50 Rider Pilot:** See docs `E:\startup idea\PRD...` and `Startup_Work_Plan...pdf`
