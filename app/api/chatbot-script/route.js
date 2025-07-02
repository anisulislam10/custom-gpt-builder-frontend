// In app/api/chatbot-script/route.js
export async function GET() {
  const res = await fetch('https://back.techrecto.com/api/chatbot/script.js');
  const script = await res.text();
  console.log('[Next.js] Fetched script.js content length:', script.length);
  return new Response(script, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}