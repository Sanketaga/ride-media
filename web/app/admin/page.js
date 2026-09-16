"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function Admin() {
  const [leads, setLeads] = useState([]);
  const [trips, setTrips] = useState([]);
  useEffect(()=>{ supabase.from('leads').select('*').order('created_at',{ascending:false}).limit(20).then(r=>setLeads(r.data||[])); supabase.from('trips').select('*').order('created_at',{ascending:false}).limit(20).then(r=>setTrips(r.data||[])); },[]);
  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800 }}>Ride Media — Admin (You)</h1>
      <p style={{ color:'#334155' }}>Leads → Create Campaign → KYC/Selfie queues → Live map → Finance. RLS: only role=admin sees this.</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:16 }}>
        <div style={{ background:'white', border:'1px solid #E2E8F0', borderRadius:12, padding:16 }}>
          <h3 style={{ margin:0 }}>Leads (last 20)</h3>
          {leads.length===0 ? <p style={{color:'#64748B'}}>No leads yet — submit at /brands</p> : leads.map(l=>
            <div key={l.id} style={{ borderTop:'1px solid #F1F5F9', padding:'10px 0' }}>
              <b>{l.brand_name}</b> — {l.phone} — {l.shirt_background} / {l.days}d — {l.zone_pincodes?.join(',')} — <span style={{ color:'#059669', fontWeight:700 }}>{l.status}</span>
              <div style={{ color:'#64748B', fontSize:12 }}>{l.ad_image_url} • {new Date(l.created_at).toLocaleString()}</div>
            </div>
          )}
          <button style={{ marginTop:10, background:'#0F172A', color:'white', padding:'8px 12px', borderRadius:8, border:'none' }}>Create Campaign from Lead →</button>
        </div>
        <div style={{ background:'white', border:'1px solid #E2E8F0', borderRadius:12, padding:16 }}>
          <h3 style={{ margin:0 }}>Trips (last 20) + eKM</h3>
          {trips.length===0 ? <p style={{color:'#64748B'}}>No trips yet — start Rider App</p> : trips.map(t=><div key={t.id} style={{ borderTop:'1px solid #F1F5F9', padding:'6px 0', fontSize:13 }}>{t.rider_id.slice(0,8)} — {t.raw_km} km → <b>{t.ekm} eKM</b> → Rs.{t.earnings} — {t.verified ? 'verified' : 'void'}</div>)}
          <div style={{ marginTop:10, color:'#64748B', fontSize:12 }}>Mapbox heatmap + selfie queue + payout cron next sprint.</div>
        </div>
      </div>
      <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:12, padding:12, marginTop:16 }}>
        <b>Next:</b> Add Mapbox heatmap, selfie queue (confidence &gt;85 auto-pass), RazorpayX cron at 9 PM. All tables have RLS — test with 2 test riders before 50.
      </div>
    </main>
  );
}
