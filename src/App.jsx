import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import ProtectedRoute from './components/ProtectedRoute';
import BoardWorkspace from './pages/boards/BoardWorkspace';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/boards"
        element={
          <ProtectedRoute>
            <BoardWorkspace />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
