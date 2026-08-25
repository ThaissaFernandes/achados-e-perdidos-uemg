import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MobileLayout from './components/MobileLayout';
import Home from './pages/Home';
import RegistrarItem from './pages/RegistrarItem';
import Profile from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MobileLayout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<RegistrarItem />} />
          <Route path="profile" element={<Profile />} />
          <Route path="search" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}