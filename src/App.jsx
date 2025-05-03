import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard/dashboard';
import ProtectedRoute from './components/ProtectedRoute'; // ⬅️ novo import
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
