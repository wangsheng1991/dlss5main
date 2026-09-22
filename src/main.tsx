import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { i18nReady } from './i18n';

const root = createRoot(document.getElementById('root')!);
const draw = () => root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

/**
 * The visitor's language pack is fetched on demand, so the app is drawn once it is in hand rather
 * than in English first. Waiting forever is not an option either: if the pack is slow or blocked the
 * app is drawn anyway after a moment and picks the translation up when it arrives, which is also
 * what keeps a broken fetch from leaving the static shell on screen.
 */
void Promise.race([i18nReady, new Promise((resolve) => setTimeout(resolve, 1500))]).then(draw, draw);
