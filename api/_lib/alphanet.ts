import { AlphaNetClient } from '../../integrations/alphanet-client.mjs';

export const alphaNet = new AlphaNetClient({
  baseUrl: process.env.ALPHANET_BASE_URL || 'https://dashboard.alphanetplus.com',
  apiKey: process.env.ALPHANET_API_KEY || '',
});
