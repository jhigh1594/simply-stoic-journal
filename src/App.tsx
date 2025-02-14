import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Planning from './pages/Planning';
import { AuthProvider } from './providers/AuthProvider';
import Journal from './pages/Journal';
import { ProtectedRoute } from './components/ProtectedRoute';
import AuthPage from './pages/Auth';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Protected Routes with MainLayout */}
          <Route element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="/" element={<Home />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/planning" element={<Planning />} />
          </Route>
          
          {/* Redirect unmatched routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;