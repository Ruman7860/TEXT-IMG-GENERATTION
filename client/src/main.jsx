import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css'
import App from './App.jsx'
import AppContextProvider from './context/AppContent.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <Toaster position="bottom-right" reverseOrder={true}/>
      <App />
    </AppContextProvider>
  </BrowserRouter>,
)
