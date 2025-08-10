import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from '../src/components/App/App.jsx';

import 'modern-normalize';

// import '../src/styles/styles.css';            треба перевірити основні стилі і підключити сюди

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
