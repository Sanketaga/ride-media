# Rider App — Ride Media (Expo)

**Hinglish + OnePlus 11 tested + Secure**

Run:
```bash
cd rider-app
cp ../.env.example .env  # fill EXPO_PUBLIC_SUPABASE_URL/ANON_KEY
npm install
npx expo start  # QR → OnePlus 11
# Build APK for WhatsApp:
npx eas build -p android --profile preview
```

**Sprints:**
*   Sprint 1: Onboard, Home Start/Stop, GPS foreground, ledger (this scaffold)
*   Sprint 2: Camera (front 5s video + back photo), stationary-only logic, mock check, RLS

**OnePlus 11 fix:** Settings → Apps → Ride Media → Battery → Unrestricted + Allow background + Allow location all the time. Else OxygenOS kills GPS.

**Security:** No service_role key in app, only anon. GPS batch 30s, 5MB image limit, zod.
