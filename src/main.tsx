import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
if (window.location.hash) {
  history.replaceState(null, '', window.location.pathname + window.location.search);
}

createRoot(document.getElementById('root')!).render(<App />);
