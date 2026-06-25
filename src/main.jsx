// src/main.jsx
// Entry point — bọc ứng dụng với Redux Provider và React Router

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Provider: cung cấp Redux store cho toàn bộ component tree */}
    <Provider store={store}>
      {/* BrowserRouter: kích hoạt React Router */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
