import Link from 'next/link';
export default function Home() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <b style={{ color: '#2563EB' }}>RIDE MEDIA</b>
        <Link href="/brands" style={{ background: '#0F172A', color: 'white', padding: '10px 16px', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>Brand? Advertise →</Link>
      </nav>
      <h1 style={{ fontSize: 44, lineHeight: 1.05, marginTop: 32 }}>Turn Every<br/>Delivery Ride<br/><span style={{ color: '#2563EB' }}>Into Media.</span></h1>
      <p style={{ color: '#334155', lineHeight: 1.6, marginTop: 12 }}>Verified GPS + stationary selfie. 50 riders in South Delhi. Hyper-local street impressions at hoarding-beating CPM.<br/>For riders: Extra Rs.3.6k/month. For brands: 96k impressions/rider/month.</p>
      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <Link href="/brands" style={{ background: '#2563EB', color: 'white', padding: '14px 18px', borderRadius: 12, textDecoration: 'none', fontWeight: 800 }}>Brand Lead Form →</Link>
        <Link href="/admin" style={{ background: 'white', color: '#0F172A', padding: '14px 18px', borderRadius: 12, textDecoration: 'none', fontWeight: 700, border: '1px solid #E2E8F0' }}>Admin Login</Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 28 }}>
        {[{k:'Rs.57',l:'CPM'},{k:'96k',l:'Impressions / rider'},{k:'17%+',l:'Rider uplift'}].map(i=> <div key={i.k} style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 16, textAlign: 'center' }}><div style={{ fontSize: 22, fontWeight: 800 }}>{i.k}</div><div style={{ color:'#64748B', fontSize: 12 }}>{i.l}</div></div>)}
      </div>
    </main>
  );
}
