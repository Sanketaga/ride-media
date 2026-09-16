import { useEffect, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { supabase } from '../lib/supabase';
import { t } from '../lib/strings';

const TASK = 'ride-media-tracking';

// Rate limit: 1 batch / 30s, max 65km/h, stationary check 45s
TaskManager.defineTask(TASK, async ({ data, error }) => {
  if (error) return;
  if (data) {
    const { locations } = data;
    // Basic mock + physics check: isFromMockProvider is Android-only, checked server-side too
    // Here we just batch; server validates.
    // In real, POST to supabase Edge Function /gps-batch with zod validation
    // console.log('gps', locations[0].coords);
  }
});

export default function Home() {
  const [earning, setEarning] = useState(false);
  const [stats, setStats] = useState({ raw: 0, ekm: 0, rs: 0 });

  const start = async () => {
    const { status: fg } = await Location.requestForegroundPermissionsAsync();
    const { status: bg } = await Location.requestBackgroundPermissionsAsync();
    if (fg !== 'granted' || bg !== 'granted') return Alert.alert('Permission chahiye', 'Location + Background allow karo OnePlus 11 me. Settings → Apps → Ride Media → Permissions → Allow all the time');
    // Selfie gate: here we mock pass, Sprint 2 adds camera
    Alert.alert(t.startSelfieTitle, t.startSelfieDesc + '\n' + t.stationaryNote);
    await Location.startLocationUpdatesAsync(TASK, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 7000,
      distanceInterval: 15,
      foregroundService: { notificationTitle: 'Ride Media — Earning ON', notificationBody: 'GPS chal raha hai. Shirt pehno, safe chalo.' },
      pausesUpdatesAutomatically: false,
    });
    setEarning(true);
  };
  const stop = async () => {
    const is = await Location.hasStartedLocationUpdatesAsync(TASK);
    if (is) await Location.stopLocationUpdatesAsync(TASK);
    setEarning(false);
    // In real: POST /trip/end → supabase trips insert + ekm calc
    Alert.alert('Band kiya', 'Trip save hua. Ledger me dekho. Payout raat 9 baje.');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F1F5F9', padding: 16 }}>
      <View style={{ backgroundColor: earning ? '#DCFCE7' : 'white', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: earning ? '#86EFAC' : '#E2E8F0' }}>
        <Text style={{ fontWeight: '800', color: '#0F172A', fontSize: 16 }}>{earning ? '● Earning ON — Kamaai chal rahi hai' : '○ Earning OFF'}</Text>
        <Text style={{ color: '#64748B', marginTop: 4, fontSize: 12 }}>{t.nextCheck} — 2-3/day, tabhi jab gadi ruki ho</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
          <View style={{ flex: 1, backgroundColor: 'white', padding: 12, borderRadius: 12, alignItems: 'center' }}><Text style={{ fontWeight: '800', fontSize: 18, color: '#0F172A' }}>{stats.raw.toFixed(1)} km</Text><Text style={{ color: '#64748B', fontSize: 11 }}>{t.rawKm}</Text></View>
          <View style={{ flex: 1, backgroundColor: '#0F172A', padding: 12, borderRadius: 12, alignItems: 'center' }}><Text style={{ fontWeight: '800', fontSize: 18, color: 'white' }}>{stats.ekm.toFixed(1)}</Text><Text style={{ color: '#94A3B8', fontSize: 11 }}>{t.ekm}</Text></View>
          <View style={{ flex: 1, backgroundColor: '#2563EB', padding: 12, borderRadius: 12, alignItems: 'center' }}><Text style={{ fontWeight: '800', fontSize: 18, color: 'white' }}>Rs.{stats.rs.toFixed(0)}</Text><Text style={{ color: '#DBEAFE', fontSize: 11 }}>{t.earnings}</Text></View>
        </View>
      </View>
      <Pressable onPress={earning ? stop : start} style={{ backgroundColor: earning ? '#DC2626' : '#2563EB', padding: 18, borderRadius: 14, marginTop: 16 }}><Text style={{ color: 'white', textAlign: 'center', fontWeight: '800', fontSize: 16 }}>{earning ? t.stopEarning : t.startEarning}</Text></Pressable>
      <Text style={{ color: '#64748B', fontSize: 11, marginTop: 10, textAlign: 'center' }}>{t.helmet} • OnePlus 11 me Settings → Battery → Unrestricted karo.</Text>
    </View>
  );
}
