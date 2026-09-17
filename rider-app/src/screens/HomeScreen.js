import { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { useLang } from '../lib/strings';

const TASK = 'ride-media-tracking';

TaskManager.defineTask(TASK, async ({ data, error }) => {
  if (error) return;
  // Server validates mock + speed + batch 30s
});

export default function HomeScreen({ navigation }) {
  const [lang,, t] = useLang();
  const [earning, setEarning] = useState(false);
  const [stats] = useState({ raw: 0, ekm: 0, rs: 0 });

  const start = async () => {
    const { status: fg } = await Location.requestForegroundPermissionsAsync();
    const { status: bg } = await Location.requestBackgroundPermissionsAsync();
    if (fg !== 'granted' || bg !== 'granted') return Alert.alert('Permission chahiye', 'Location → Allow all the time + Battery → Unrestricted (OnePlus 11)');
    Alert.alert(t.startEarning, 'Front 5s video + Back photo — 2 min me approve. ' + t.nextCheck);
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
    const has = await Location.hasStartedLocationUpdatesAsync(TASK);
    if (has) await Location.stopLocationUpdatesAsync(TASK);
    setEarning(false);
    Alert.alert('Band kiya', 'Trip save hua. Ledger me dekho. Payout raat 9 baje.');
  };

  return (
    <View style={{ flex:1, backgroundColor:'#F1F5F9', padding:16 }}>
      <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
        <Text style={{ fontWeight:'800', color:'#0F172A' }}>{t.homeTitle} — {t.appName}</Text>
        <Pressable onPress={()=>navigation.navigate('Language')} style={{ borderWidth:1, borderColor:'#E2E8F0', backgroundColor:'white', paddingHorizontal:10, paddingVertical:6, borderRadius:20 }}>
          <Text style={{ color:'#334155', fontWeight:'700', fontSize:12 }}>🌐 {lang}</Text>
        </Pressable>
      </View>

      <View style={{ backgroundColor: earning ? '#DCFCE7' : 'white', padding:16, borderRadius:16, borderWidth:1, borderColor: earning ? '#86EFAC' : '#E2E8F0', marginTop:12 }}>
        <Text style={{ fontWeight:'800', color:'#0F172A', fontSize:16 }}>{earning ? '● ' + t.earningOn : '○ ' + t.earningOff}</Text>
        <Text style={{ color:'#64748B', marginTop:4, fontSize:12 }}>{t.nextCheck}</Text>
        <View style={{ flexDirection:'row', gap:12, marginTop:12 }}>
          <View style={{ flex:1, backgroundColor:'white', padding:12, borderRadius:12, alignItems:'center' }}><Text style={{ fontWeight:'800', fontSize:18, color:'#0F172A' }}>{stats.raw.toFixed(1)} km</Text><Text style={{ color:'#64748B', fontSize:11 }}>{t.rawKm}</Text></View>
          <View style={{ flex:1, backgroundColor:'#0F172A', padding:12, borderRadius:12, alignItems:'center' }}><Text style={{ fontWeight:'800', fontSize:18, color:'white' }}>{stats.ekm.toFixed(1)}</Text><Text style={{ color:'#94A3B8', fontSize:11 }}>{t.ekm}</Text></View>
          <View style={{ flex:1, backgroundColor:'#2563EB', padding:12, borderRadius:12, alignItems:'center' }}><Text style={{ fontWeight:'800', fontSize:18, color:'white' }}>Rs.{stats.rs.toFixed(0)}</Text><Text style={{ color:'#DBEAFE', fontSize:11 }}>{t.earnings}</Text></View>
        </View>
      </View>

      <Pressable onPress={earning ? stop : start} style={{ backgroundColor: earning ? '#DC2626' : '#2563EB', padding:18, borderRadius:14, marginTop:16 }}>
        <Text style={{ color:'white', textAlign:'center', fontWeight:'800', fontSize:16 }}>{earning ? t.stopEarning : t.startEarning}</Text>
      </Pressable>

      <Pressable onPress={()=>navigation.navigate('Ledger')} style={{ backgroundColor:'white', padding:14, borderRadius:12, marginTop:12, borderWidth:1, borderColor:'#E2E8F0' }}>
        <Text style={{ color:'#0F172A', textAlign:'center', fontWeight:'700' }}>{t.ledger} — {t.mapReplay} →</Text>
      </Pressable>
      <Pressable onPress={()=>navigation.navigate('Onboard')} style={{ padding:12, marginTop:8 }}>
        <Text style={{ color:'#64748B', textAlign:'center' }}>{t.onboard} →</Text>
      </Pressable>

      <Text style={{ color:'#64748B', fontSize:11, marginTop:10, textAlign:'center' }}>{t.helmet}</Text>
    </View>
  );
}
