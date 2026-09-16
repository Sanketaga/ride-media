import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import { t } from '../lib/strings';

// RA-01 to RA-02: OTP + KYC + Profile (simplified for vibe)
export default function Onboard() {
  const [phone, setPhone] = useState('');
  const [upi, setUpi] = useState('');
  const [size, setSize] = useState('L');
  const [zone, setZone] = useState('110048');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!phone || phone.length < 10) return Alert.alert('Phone galat hai', '10 digit number dalo');
    if (!upi.includes('@')) return Alert.alert('UPI galat hai', 'jaise: name@upi');
    setLoading(true);
    // In real: supabase.auth.signInWithOtp({ phone })
    // For MVP scaffold: insert riders row (RLS allows own)
    const { data: { user } } = await supabase.auth.getUser();
    // fallback: allow anon insert for demo if no session
    const id = user?.id || '00000000-0000-0000-0000-000000000000';
    const { error } = await supabase.from('riders').upsert({ id, phone, size, zone, upi_id: upi, vehicle: 'bike', kyc_status: 'pending' });
    setLoading(false);
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Ho gaya!', 'KYC pending — 4 ghante me approve. Campaign apply karo.');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '800', color: '#0F172A' }}>Onboard — 5 min</Text>
      <Text style={{ color: '#64748B', marginTop: 6 }}>{t.pauseDays}</Text>
      <Text style={{ marginTop: 16, fontWeight: '700', color: '#334155' }}>Phone (OTP)</Text>
      <TextInput value={phone} onChangeText={setPhone} placeholder="99999 99999" keyboardType="phone-pad" style={{ borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 12, marginTop: 6 }} />
      <Text style={{ marginTop: 12, fontWeight: '700', color: '#334155' }}>UPI ID (payout ke liye)</Text>
      <TextInput value={upi} onChangeText={setUpi} placeholder="name@upi" autoCapitalize="none" style={{ borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 12, marginTop: 6 }} />
      <Text style={{ marginTop: 12, fontWeight: '700', color: '#334155' }}>Size</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
        {['S','M','L','XL','XXL'].map(s => <Pressable key={s} onPress={()=>setSize(s)} style={{ padding: 10, borderRadius: 10, borderWidth: 1, borderColor: size===s ? '#2563EB' : '#E2E8F0', backgroundColor: size===s ? '#EFF6FF' : 'white' }}><Text style={{ fontWeight: '700', color: size===s ? '#2563EB' : '#334155' }}>{s}</Text></Pressable>)}
      </View>
      <Text style={{ marginTop: 12, fontWeight: '700', color: '#334155' }}>Zone (pincode)</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
        {['110048','110017','110025','110049'].map(z => <Pressable key={z} onPress={()=>setZone(z)} style={{ padding: 10, borderRadius: 20, borderWidth: 1, borderColor: zone===z ? '#2563EB' : '#E2E8F0', backgroundColor: zone===z ? '#0F172A' : 'white' }}><Text style={{ color: zone===z ? 'white' : '#334155', fontWeight: '600' }}>{z}</Text></Pressable>)}
      </View>
      <Pressable onPress={submit} disabled={loading} style={{ backgroundColor: loading ? '#94A3B8' : '#0F172A', padding: 16, borderRadius: 12, marginTop: 20 }}><Text style={{ color: 'white', textAlign: 'center', fontWeight: '800' }}>{loading ? 'Saving...' : 'Submit — KYC bhejo'}</Text></Pressable>
      <Text style={{ color: '#64748B', fontSize: 11, marginTop: 10, textAlign: 'center' }}>Aadhaar Digilocker + selfie + campaign browse next sprint me add hoga. Is scaffold me basic profile save hota hai.</Text>
    </ScrollView>
  );
}
