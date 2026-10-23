const original=globalThis.fetch;globalThis.fetch=(input,init)=>{const u=new URL(input);if(u.hostname==='www.dlss5nvidia.com'){u.protocol='http:';u.host='127.0.0.1:5173';}return original(u,init);};
// Cloudflare email protection replaces the unchanged home-page address in production.
// Reproduce that observed edge transform only for the home page before fingerprinting local HTML.
const localFetch=globalThis.fetch;globalThis.fetch=async(input,init)=>{const response=await localFetch(input,init);const u=new URL(input);if(u.hostname==='www.dlss5nvidia.com'&&u.pathname==='/'&&response.status===200){const html=await response.text();return new Response(html.replace(/>support@dlss5nvidia.com</g,'>[email&#160;protected]<'),{status:response.status,headers:response.headers});}return response;};
