import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Planning from './pages/Planning';
import Library from './pages/Library';
import Templates from './pages/Templates';
import { AuthProvider } from './providers/AuthProvider';
import Journal from './pages/Journal';
import LandingPage from './pages/Landing/LandingPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="journal">
              <Route index element={<Journal />} />
              <Route path=":id" element={<Journal />} />
              <Route path="new">
                <Route path="morning" element={<Journal />} />
                <Route path="evening" element={<Journal />} />
              </Route>
            </Route>
            <Route path="planning" element={<Planning />} />
            <Route path="library" element={<Library />} />
            <Route path="templates" element={<Templates />} />
            <Route path="landing" element={<LandingPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;