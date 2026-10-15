import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';

export function render(url) {
  return renderToString(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'PLACEHOLDER'}>
      <MemoryRouter initialEntries={[url]}>
        <App />
      </MemoryRouter>
    </GoogleOAuthProvider>
  );
}
