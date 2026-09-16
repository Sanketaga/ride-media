import { View, Text, FlatList, Pressable } from 'react-native';
import { t } from '../lib/strings';

// RA-04 ledger + map replay placeholder
const mock = [
  { id: 'Trip 1', time: '09:12-11:40', raw: 38.2, ekm: 42.5, rs: 63.75, verified: '2/2 pass' },
  { id: 'Trip 2', time: '12:30-14:00', raw: 18.0, ekm: 14.2, rs: 21.30, verified: '1/2 (1 missed)' },
];

export default function Ledger() {
  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{t.ledger} — Aaj</Text>
      <FlatList data={mock} keyExtractor={i=>i.id} renderItem={({item}) =>
        <View style={{ borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, marginTop: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ fontWeight: '700', color: '#0F172A' }}>{item.id}</Text><Text style={{ color: '#64748B' }}>{item.time}</Text></View>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
            <Text style={{ color: '#334155' }}>Raw {item.raw} km</Text><Text style={{ fontWeight: '700', color: '#0F172A' }}>eKM {item.ekm}</Text><Text style={{ fontWeight: '700', color: '#2563EB' }}>Rs.{item.rs}</Text>
          </View>
          <Text style={{ marginTop: 6, color: item.verified.includes('2/2') ? '#059669' : '#D97706' }}>{item.verified} • {t.mapReplay}</Text>
        </View>
      } />
      <View style={{ backgroundColor: '#EFF6FF', padding: 12, borderRadius: 12, marginTop: 12, borderWidth: 1, borderColor: '#DBEAFE' }}>
        <Text style={{ fontWeight: '800', color: '#0F172A', textAlign: 'center' }}>Total Today: 56.2 km raw → 56.7 eKM → Rs.85.05</Text>
        <Text style={{ color: '#64748B', fontSize: 11, textAlign: 'center', marginTop: 4 }}>Map Replay pe tap karo — green verified / grey void + selfie stamp dikhega. Dispute khatam.</Text>
      </View>
    </View>
  );
}
