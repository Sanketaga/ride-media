export const metadata = { title: 'Ride Media — Brands & Admin', description: 'Ride Media 50 Rider MVP' };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Inter, system-ui, sans-serif', margin: 0, background: '#F8FAFC', color: '#0F172A' }}>{children}</body>
    </html>
  );
}
