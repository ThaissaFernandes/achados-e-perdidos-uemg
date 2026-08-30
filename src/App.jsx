import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import MobileLayout from './components/layout/MobileLayout';

// Importação das Páginas
import Home from './pages/Home';
import RegistrarItem from './pages/RegistrarItem';
import Profile from './pages/Profile';
import ItemDetails from './pages/ItemDetails';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas de Autenticação (Sem a barra de navegação inferior) */}
          <Route path="login" element={<Login />} />
          <Route path="cadastro" element={<Cadastro />} />

          {/* Layout principal contendo o Header e o Bottom Navigation */}
          <Route path="/" element={<MobileLayout />}>
            {/* Rotas Públicas */}
            <Route index element={<Home />} />
            <Route path="search" element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="item/:id" element={<ItemDetails />} />

            {/* Rotas Protegidas - Apenas Administrador */}
            <Route element={<ProtectedRoute requireAdmin={true} />}>
              <Route path="register" element={<RegistrarItem />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}