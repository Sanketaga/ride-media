import { View, Text, Pressable } from 'react-native';
import { useLang } from '../lib/strings';

export default function LanguageScreen({ navigation }) {
  const [lang, saveLang, t] = useLang();

  const select = async (l) => {
    await saveLang(l);
    navigation.replace('Main');
  };

  return (
    <View style={{ flex:1, backgroundColor:'#0F172A', padding:24, justifyContent:'center' }}>
      <Text style={{ color:'#3B82F6', fontWeight:'800', letterSpacing:1 }}>RIDE MEDIA</Text>
      <Text style={{ color:'white', fontSize:32, fontWeight:'800', marginTop:8 }}>Choose Language</Text>
      <Text style={{ color:'#94A3B8', fontSize:14, marginTop:6 }}>भाषा चुनें • Language Chuniye</Text>

      <View style={{ marginTop:32, gap:14 }}>
        {[
          { id:'en', label:'English', sub:'Continue in English' },
          { id:'hi', label:'हिन्दी', sub:'हिन्दी में जारी रखें' },
          { id:'hinglish', label:'Hinglish', sub:'Hinglish me continue karo' },
        ].map(opt => (
          <Pressable key={opt.id} onPress={()=>select(opt.id)} style={{ backgroundColor: lang===opt.id ? '#2563EB' : 'white', padding:18, borderRadius:14, borderWidth: lang===opt.id ? 2 : 0, borderColor:'#3B82F6' }}>
            <Text style={{ fontWeight:'800', fontSize:16, color: lang===opt.id ? 'white' : '#0F172A' }}>{opt.label}</Text>
            <Text style={{ color: lang===opt.id ? '#DBEAFE' : '#64748B', marginTop:2 }}>{opt.sub}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={{ color:'#64748B', textAlign:'center', marginTop:20, fontSize:12 }}>You can change this later in Profile • बाद में बदल सकते हो</Text>
    </View>
  );
}
