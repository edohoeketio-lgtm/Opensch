import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Dynamic params
    const title = searchParams.get('title') ?? 'AI-Native Product Builder';
    const name = searchParams.get('name') ?? 'Michael';
    const description = searchParams.get('description') ?? 'has successfully acquired the skills to design, build, and ship real products.';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#000000',
            fontFamily: 'sans-serif',
            padding: '80px',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '80px',
              left: '80px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000000',
                fontSize: '24px',
                fontWeight: 800,
                marginRight: '16px'
              }}
            >
              O
            </div>
            <span style={{ color: '#ffffff', fontSize: '32px', fontWeight: 800, letterSpacing: '-0.05em' }}>
              OpenSch
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: '60px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 24px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #2c2c2e',
                borderRadius: '999px',
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '40px',
              }}
            >
              Official Certification
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', color: '#8e8e93', fontSize: '48px', fontWeight: 400, marginBottom: '32px' }}>
              <div style={{ display: 'flex', marginBottom: '12px' }}>
                 <span style={{ color: '#ffffff', fontWeight: 600 }}>{name}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '1000px', lineHeight: 1.2 }}>
                 {description}
              </div>
            </div>

            <div style={{ color: '#ffffff', fontSize: '84px', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.05em', display: 'flex', maxWidth: '1000px', flexWrap: 'wrap' }}>
              {title}
            </div>
          </div>
          
          {/* Decorative Bottom Line */}
          <div style={{ position: 'absolute', bottom: '80px', left: '80px', right: '80px', height: '2px', backgroundColor: '#1a1a1a', display: 'flex' }} />
          <div style={{ position: 'absolute', bottom: '80px', left: '80px', height: '2px', width: '200px', backgroundColor: '#ffffff', display: 'flex' }} />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
