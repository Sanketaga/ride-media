"use client";
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function Brands() {
  const [form, setForm] = useState({ brand_name:'', phone:'', email:'', days:30, shirt_background:'white', pincodes:[], message:'' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const togglePin = (p) => setForm(f => ({...f, pincodes: f.pincodes.includes(p) ? f.pincodes.filter(x=>x!==p) : [...f.pincodes, p]}));
  const onFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5*1024*1024) return alert('5MB max');
    if (!['image/jpeg','image/png','image/webp'].includes(f.type)) return alert('Only JPG/PNG');
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };
  const submit = async (e) => {
    e.preventDefault();
    if (!form.brand_name || !form.phone || !file) return alert('Brand name, phone, ad image required');
    if (form.pincodes.length===0) return alert('Pick at least 1 pincode');
    setLoading(true);
    try {
      // 1. Upload ad image to private bucket via anon (RLS allows)
      const path = `leads/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from('ad-images').upload(path, file, { contentType: file.type });
      if (upErr) throw upErr;
      // 2. Insert lead via RPC (security definer, bypasses RLS for anon)
      const { data: newId, error } = await supabase.rpc('insert_lead', {
        p_brand_name: form.brand_name,
        p_phone: form.phone,
        p_email: form.email || null,
        p_ad_image_url: path,
        p_shirt_background: form.shirt_background,
        p_shirt_type: 'Round Neck 180 GSM',
        p_days: form.days,
        p_zone_pincodes: form.pincodes,
        p_message: form.message || null,
      });
      if (error) throw error;
      setDone(true);
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  if (done) return <main style={{ maxWidth: 640, margin: '40px auto', padding: 24, background: 'white', borderRadius: 16, textAlign: 'center' }}><h2>Thank you! 🙏</h2><p style={{color:'#334155'}}>Lead sent. We will call/WhatsApp in 2 hours. Check phone: {form.phone}</p><p style={{color:'#64748B', fontSize: 12}}>Admin will create campaign from your ad image + {form.shirt_background} background + {form.days} days + pincodes {form.pincodes.join(', ')}</p></main>;

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Brand Lead — Ride Media</h1>
      <p style={{ color:'#334155' }}>Upload ad picture, pick background (white/black/navy), days 30/60/90, pincodes. We handle print + riders. Round Neck 180 GSM fixed for MVP.</p>
      <form onSubmit={submit} style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 16, padding: 20, marginTop: 16, display: 'grid', gap: 14 }}>
        <label>Brand Name*<input required value={form.brand_name} onChange={e=>setForm({...form,brand_name:e.target.value})} placeholder="e.g., Sharma Coaching" style={{ width:'100%', padding:12, borderRadius:10, border:'1px solid #E2E8F0', marginTop:6 }} /></label>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <label>Phone / WhatsApp*<input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="99999 99999" style={{ width:'100%', padding:12, borderRadius:10, border:'1px solid #E2E8F0', marginTop:6 }} /></label>
          <label>Email<input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="brand@email.com" style={{ width:'100%', padding:12, borderRadius:10, border:'1px solid #E2E8F0', marginTop:6 }} /></label>
        </div>
        <label>Ad Picture* (JPG/PNG, 5MB max)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} style={{ marginTop:6 }} /></label>
        {preview && <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
          {['white','black','navy'].map(bg => <div key={bg} onClick={()=>setForm({...form,shirt_background:bg})} style={{ border: form.shirt_background===bg ? '2px solid #2563EB' : '1px solid #E2E8F0', borderRadius:12, padding:12, background: bg==='white' ? 'white' : bg==='black' ? '#0F172A' : '#1E293B', cursor:'pointer', textAlign:'center' }}>
            <div style={{ fontWeight:700, color: bg==='white' ? '#0F172A' : 'white' }}>{bg} background {form.shirt_background===bg ? '✓' : ''}</div>
            <img src={preview} alt="preview" style={{ width:'100%', height:90, objectFit:'contain', marginTop:8, background: bg==='white' ? '#F1F5F9' : 'white', borderRadius:8 }} />
          </div>)}
        </div>}
        <div><div style={{ fontWeight:700 }}>Days*</div>
          <div style={{ display:'flex', gap:8, marginTop:6 }}>
            {[30,60,90].map(d => <button key={d} type="button" onClick={()=>setForm({...form,days:d})} style={{ flex:1, padding:12, borderRadius:10, border: form.days===d ? '2px solid #0F172A' : '1px solid #E2E8F0', background: form.days===d ? '#0F172A' : 'white', color: form.days===d ? 'white' : '#0F172A', fontWeight:700 }}>{d} days</button>)}
          </div>
          <div style={{ color:'#64748B', fontSize:12, marginTop:6 }}>T-shirt: Round Neck 180 GSM (fixed for 50 MVP). ~Rs.27k for 5 riders / 30 days.</div>
        </div>
        <div><div style={{ fontWeight:700 }}>Pin Codes* (South Delhi cluster)</div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:6 }}>
            {['110048','110017','110025','110049'].map(p=> <button key={p} type="button" onClick={()=>togglePin(p)} style={{ padding:'8px 14px', borderRadius:20, border: form.pincodes.includes(p) ? '2px solid #2563EB' : '1px solid #E2E8F0', background: form.pincodes.includes(p) ? '#2563EB' : 'white', color: form.pincodes.includes(p) ? 'white' : '#334155', fontWeight:600 }}>{p}</button>)}
          </div>
        </div>
        <label>Message<input value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Offer, timing, etc." style={{ width:'100%', padding:12, borderRadius:10, border:'1px solid #E2E8F0', marginTop:6 }} /></label>
        <button disabled={loading} style={{ background: loading ? '#94A3B8' : '#2563EB', color:'white', padding:14, borderRadius:12, fontWeight:800, border:'none' }}>{loading ? 'Sending...' : 'Send Lead — We call in 2 hrs →'}</button>
        <div style={{ color:'#64748B', fontSize:11, textAlign:'center' }}>No payment now. Lead only. We create campaign in Admin after call. Secure upload: 5MB, signed URL 5 min.</div>
      </form>
    </main>
  );
}
