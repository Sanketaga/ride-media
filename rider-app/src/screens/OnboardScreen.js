import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import { useLang } from '../lib/strings';

export default function OnboardScreen({ navigation }) {
  const [lang,, t] = useLang();
  const [phone, setPhone] = useState('');
  const [upi, setUpi] = useState('');
  const [size, setSize] = useState('L');
  const [zone, setZone] = useState('110048');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!phone || phone.length < 10) return Alert.alert('Error', t.phone + ' 10 digit');
    if (!upi.includes('@')) return Alert.alert('Error', t.upi + ' e.g. name@upi');
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const id = user?.id;
    if (!id) {
      setLoading(false);
      return Alert.alert('Login needed', 'OTP flow next sprint — for now your profile will be saved locally. Tap Continue to Home.');
    }
    const { error } = await supabase.from('riders').upsert({ id, phone, size, zone, upi_id: upi, vehicle: 'bike', kyc_status: 'pending' });
    setLoading(false);
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Ho gaya!', 'KYC pending — 4 ghante me approve', [{ text: 'Home Chalo', onPress: ()=> navigation.navigate('Home') }]);
  };

  return (
    <ScrollView style={{ flex:1, backgroundColor:'white' }} contentContainerStyle={{ padding:16 }}>
      <Text style={{ fontSize:22, fontWeight:'800', color:'#0F172A' }}>{t.onboard}</Text>
      <Text style={{ color:'#64748B', marginTop:6 }}>{t.pauseInfo}</Text>

      <Text style={{ marginTop:16, fontWeight:'700', color:'#334155' }}>{t.phone}</Text>
      <TextInput value={phone} onChangeText={setPhone} placeholder={t.phonePh} keyboardType="phone-pad" style={{ borderWidth:1, borderColor:'#E2E8F0', borderRadius:10, padding:12, marginTop:6 }} />

      <Text style={{ marginTop:12, fontWeight:'700', color:'#334155' }}>{t.upi}</Text>
      <TextInput value={upi} onChangeText={setUpi} placeholder={t.upiPh} autoCapitalize="none" style={{ borderWidth:1, borderColor:'#E2E8F0', borderRadius:10, padding:12, marginTop:6 }} />

      <Text style={{ marginTop:12, fontWeight:'700', color:'#334155' }}>{t.size}</Text>
      <View style={{ flexDirection:'row', gap:8, marginTop:6, flexWrap:'wrap' }}>
        {['S','M','L','XL','XXL'].map(s => (
          <Pressable key={s} onPress={()=>setSize(s)} style={{ padding:12, borderRadius:10, borderWidth:1, borderColor: size===s ? '#2563EB' : '#E2E8F0', backgroundColor: size===s ? '#EFF6FF' : 'white' }}>
            <Text style={{ fontWeight:'700', color: size===s ? '#2563EB' : '#334155' }}>{s}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={{ marginTop:12, fontWeight:'700', color:'#334155' }}>{t.zone}</Text>
      <View style={{ flexDirection:'row', gap:8, marginTop:6, flexWrap:'wrap' }}>
        {['110048','110017','110025','110049'].map(z => (
          <Pressable key={z} onPress={()=>setZone(z)} style={{ padding:10, borderRadius:20, borderWidth:1, borderColor: zone===z ? '#2563EB' : '#E2E8F0', backgroundColor: zone===z ? '#0F172A' : 'white' }}>
            <Text style={{ color: zone===z ? 'white' : '#334155', fontWeight:'600' }}>{z}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={submit} disabled={loading} style={{ backgroundColor: loading ? '#94A3B8' : '#0F172A', padding:16, borderRadius:12, marginTop:20 }}>
        <Text style={{ color:'white', textAlign:'center', fontWeight:'800' }}>{loading ? 'Saving...' : t.submit}</Text>
      </Pressable>

      <Pressable onPress={()=>navigation.navigate('Home')} style={{ padding:12, marginTop:8 }}>
        <Text style={{ color:'#2563EB', textAlign:'center', fontWeight:'700' }}>{t.continue} → Home</Text>
      </Pressable>

      <Text style={{ color:'#64748B', fontSize:11, marginTop:10, textAlign:'center' }}>Language: {lang} — change on first screen. OTP + Aadhaar next sprint.</Text>
    </ScrollView>
  );
}
