import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import  AuthProvider  from './context/AuthProvider'; // ✅ Correct import

const root = createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
);
