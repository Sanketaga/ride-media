import { View, Text, Pressable, Linking } from 'react-native';
import { Link } from 'expo-router';
import { t } from '../lib/strings';

export default function Index() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F1F5F9', padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 32, fontWeight: '800', color: '#0F172A' }}>Ride Media</Text>
      <Text style={{ color: '#334155', marginTop: 8, lineHeight: 20 }}>50 Rider MVP — Expo + Supabase{'\n'}OnePlus 11 tested • Hinglish • Stationary-only selfie</Text>
      <View style={{ marginTop: 24, gap: 12 }}>
        <Link href="/onboard" asChild><Pressable style={{ backgroundColor: '#2563EB', padding: 16, borderRadius: 12 }}><Text style={{ color: 'white', textAlign: 'center', fontWeight: '700' }}>Onboard — 5 min me shuru karo →</Text></Pressable></Link>
        <Link href="/home" asChild><Pressable style={{ backgroundColor: 'white', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' }}><Text style={{ color: '#0F172A', textAlign: 'center', fontWeight: '700' }}>Home — {t.today} dekho</Text></Pressable></Link>
        <Link href="/ledger" asChild><Pressable style={{ backgroundColor: 'white', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' }}><Text style={{ color: '#0F172A', textAlign: 'center', fontWeight: '700' }}>{t.ledger} — Map Replay</Text></Pressable></Link>
      </View>
      <Text style={{ color: '#64748B', fontSize: 12, marginTop: 20, textAlign: 'center' }}>{t.helmet}</Text>
    </View>
  );
}
