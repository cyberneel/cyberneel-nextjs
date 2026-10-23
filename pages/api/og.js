import { ImageResponse } from 'next/og';

export const config = { runtime: 'edge' };

// Share card: /api/og?title=...&type=Article&date=...
// Flat black, white type, red "Neel". Rendered at request time and cached by the CDN.
export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get('title') || 'Neelesh Chevuri').slice(0, 110);
  const type = (searchParams.get('type') || '').slice(0, 24);
  const date = (searchParams.get('date') || '').slice(0, 24);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#000',
          color: '#fff',
          padding: '72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '30px', fontWeight: 600 }}>
          {/* satori drops the r/N kerning across spans; the margin puts it back */}
          <div style={{ display: 'flex' }}>
            <span>Cyber</span>
            <span style={{ color: '#d53e3b', marginLeft: '-0.08em' }}>Neel</span>
          </div>
          <div style={{ display: 'flex', color: '#a3a3a3', fontWeight: 400 }}>{type}</div>
        </div>
        <div style={{ display: 'flex', fontSize: title.length > 64 ? '60px' : '80px', fontWeight: 500, lineHeight: 1.04, letterSpacing: '-0.035em', maxWidth: '1040px' }}>
          {title}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '28px', fontSize: '24px', color: '#a3a3a3' }}>
          <div style={{ display: 'flex' }}>Neelesh Chevuri, cyberneel.com</div>
          <div style={{ display: 'flex' }}>{date}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
