import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Modal from 'react-modal';

import './i18n';

import { store } from './redux/store.js';

import App from '../src/components/App/App.jsx';

import 'modern-normalize';

import '../src/styles/styles.css';

Modal.setAppElement('#root');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
