import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { i18nReady } from './i18n';
import { initClarity } from './lib/clarity';

// Keep analytics third-party work off the critical render path. With no project ID this is a no-op.
if (typeof window !== 'undefined') {
  const startClarity = () => initClarity();
  const requestIdle = (window as Window & {
    requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  }).requestIdleCallback;
  if (requestIdle) {
    requestIdle(startClarity, { timeout: 2000 });
  } else {
    setTimeout(startClarity, 0);
  }
}

const rootElement = document.getElementById('root')!;
// These prerendered pages must retain their real content while the initial route loads.
const retainedRoutes = new Set([
  '/download', '/visual-enhancer',
  '/blog/core-game-frame-style-reference',
  '/blog/core-two-reference-room-workflow',
  '/blog/core-redraw-review-checklist',
]);
const prerenderedPage = retainedRoutes.has(window.location.pathname.replace(/\/+$/, ''))
  && rootElement.querySelector('main') ? rootElement.innerHTML : undefined;
const root = createRoot(rootElement);
const draw = () => root.render(
  <StrictMode>
    <App prerenderedPage={prerenderedPage} />
  </StrictMode>,
);

/**
 * The visitor's language pack is fetched on demand, so the app is drawn once it is in hand rather
 * than in English first. Waiting forever is not an option either: if the pack is slow or blocked the
 * app is drawn anyway after a moment and picks the translation up when it arrives, which is also
 * what keeps a broken fetch from leaving the static shell on screen.
 */
void Promise.race([i18nReady, new Promise((resolve) => setTimeout(resolve, 1500))]).then(draw, draw);
