export async function GET() {
  try {
    const res = await fetch('https://back.techrecto.com/api/chatbot/script.js', {
      cache: 'no-store', // Prevent caching issues
    });
    if (!res.ok) {
      console.error('[Next.js] Failed to fetch script.js:', res.status, res.statusText);
      return new Response('Failed to fetch chatbot script', { status: 500 });
    }
    const script = await res.text();
    console.log('[Next.js] Fetched script.js content length:', script.length);
    return new Response(script, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    console.error('[Next.js] Error fetching script.js:', error.message);
    return new Response('Error fetching chatbot script', { status: 500 });
  }
}