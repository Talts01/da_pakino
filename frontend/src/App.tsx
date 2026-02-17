import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MenuPage from './pages/MenuPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotta principale: Il Menu Clienti */}
        <Route path="/" element={<MenuPage />} />
        
        {/* Rotta Admin: Il Pannello di controllo */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;