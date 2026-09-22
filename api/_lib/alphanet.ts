import { AlphaNetClient } from '../../integrations/alphanet-client.mjs';

export const alphaNet = new AlphaNetClient({
  baseUrl: process.env.ALPHANET_BASE_URL || 'https://dashboard.alphanetplus.com',
  apiKey: process.env.ALPHANET_API_KEY || '',
});

// The studio's C-line tools (background removal, object erasing) answer under the same project by
// default, so the same key covers them. Setting ALPHANET_TOOLS_API_KEY gives them their own
// allowance and invoice without touching a line of calling code — same trick as super resolution.
export const alphaNetTools = new AlphaNetClient({
  baseUrl: process.env.ALPHANET_BASE_URL || 'https://dashboard.alphanetplus.com',
  apiKey: process.env.ALPHANET_TOOLS_API_KEY || process.env.ALPHANET_API_KEY || '',
});

// Super resolution is the same AlphaNet API under its own key, so the capability is provisioned and
// billed separately while the upload/submit/poll flow stays identical. The super-resolution request
// contract (model name, how the 2×/4× factor is expressed) is not fixed yet, so nothing calls this
// instance until it is: see docs/alphanet/superres-api-for-integrator.md once that document lands.
export const alphaNetSuperRes = new AlphaNetClient({
  baseUrl: process.env.ALPHANET_BASE_URL || 'https://dashboard.alphanetplus.com',
  apiKey: process.env.ALPHANET_SUPERRES_API_KEY || '',
});
