import { Stack } from 'expo-router';
export default function Layout() {
  return <Stack screenOptions={{ headerStyle: { backgroundColor: '#0F172A' }, headerTintColor: 'white', headerTitleStyle: { fontWeight: '700' } }}>
    <Stack.Screen name="index" options={{ title: 'Ride Media — Rider' }} />
    <Stack.Screen name="onboard" options={{ title: 'Onboard — 5 min' }} />
    <Stack.Screen name="home" options={{ title: 'Aaj Ka — Today' }} />
    <Stack.Screen name="ledger" options={{ title: 'Hisab — Ledger' }} />
  </Stack>;
}
