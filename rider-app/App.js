import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import LanguageScreen from './src/screens/LanguageScreen';
import OnboardScreen from './src/screens/OnboardScreen';
import HomeScreen from './src/screens/HomeScreen';
import LedgerScreen from './src/screens/LedgerScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator initialRouteName="Language" screenOptions={{ headerStyle:{backgroundColor:'#0F172A'}, headerTintColor:'white', headerTitleStyle:{fontWeight:'700'} }}>
        <Stack.Screen name="Language" component={LanguageScreen} options={{ headerShown:false }} />
        <Stack.Screen name="Main" component={HomeScreen} options={{ title:'Ride Media' }} />
        <Stack.Screen name="Onboard" component={OnboardScreen} options={{ title:'Onboard' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title:'Home' }} />
        <Stack.Screen name="Ledger" component={LedgerScreen} options={{ title:'Ledger' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
