import React from 'react'
import ReactDOM from 'react-dom/client'
import TestHome from './testHome';
import APP from './App';
import './index.css'
import { Provider } from 'react-redux';
import store from './store/store';
import { RouterProvider } from 'react-router-dom';
import router from './routes';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <App /> */}
      {/* <RouterProvider router={router} /> */}

      <TestHome />
    </Provider>
  </React.StrictMode>,
)
