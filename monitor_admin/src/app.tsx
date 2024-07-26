import React from 'react';
// import './app.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { GlobalModal } from '@/src/components/globalModal';
import { routes } from '@/src/router';
import { store } from '@/src/models/store';
const router = createBrowserRouter(routes);

function App() {
  return (
    <Provider store={store}>
      <div className='bg-red-400'>
        <RouterProvider router={router} />

        <GlobalModal />
      </div>
    </Provider>
  );
}

export default App;
