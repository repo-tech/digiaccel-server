import { Navigate, Route, Routes } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Search from './pages/Search';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route path="/home" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
