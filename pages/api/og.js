import { ImageResponse } from 'next/og';

export const config = { runtime: 'edge' };

// Branded Open Graph card: /api/og?title=…&type=Article&date=…
// Rendered at request time and cached by the CDN. Pure typography + a
// monogram so it never depends on fetching external/webp art.
export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const rawTitle = (searchParams.get('title') || 'Neelesh Chevuri').slice(0, 110);
  const type = (searchParams.get('type') || '').slice(0, 24);
  const date = (searchParams.get('date') || '').slice(0, 24);

  const accent = '#d53e3b';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0b0a09',
          backgroundImage:
            'radial-gradient(1000px 500px at 88% -12%, rgba(213,62,59,0.32), transparent 60%), radial-gradient(800px 600px at -8% 110%, rgba(213,62,59,0.14), transparent 60%)',
          padding: '72px',
          fontFamily: 'sans-serif',
          color: '#f1ece6',
        }}
      >
        {/* top row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                background: accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                fontWeight: 800,
                color: '#fff',
              }}
            >
              C
            </div>
            <div style={{ display: 'flex', fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em' }}>
              <span>Cyber</span>
              <span style={{ color: accent }}>Neel</span>
            </div>
          </div>
          {type ? (
            <div
              style={{
                fontSize: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: accent,
                border: `1px solid ${accent}`,
                borderRadius: '999px',
                padding: '8px 20px',
              }}
            >
              {type}
            </div>
          ) : (
            <div />
          )}
        </div>

        {/* title */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: rawTitle.length > 64 ? '60px' : '78px',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              maxWidth: '1000px',
            }}
          >
            {rawTitle}
          </div>
        </div>

        {/* bottom row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '4px', background: accent, borderRadius: '2px' }} />
            <div style={{ fontSize: '24px', color: '#9a918a' }}>Neelesh Chevuri · cyberneel.com</div>
          </div>
          {date ? <div style={{ fontSize: '22px', color: '#6c635c' }}>{date}</div> : <div />}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
