// src/App.jsx

import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Personal from './pages/Personal';
import Lender from './pages/Lender';
import PlatfromManager from './pages/PlatfromManager';
import MyTask from './pages/MyTask';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/platform-manager"
        element={
          <ProtectedRoute>
            <PlatfromManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/personal"
        element={
          <ProtectedRoute>
            <Personal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lender"
        element={
          <ProtectedRoute>
            <Lender />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-tasks"
        element={
          <ProtectedRoute>
            <MyTask />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
