import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import HomePage from './components/HomePage';
import NormalEmployeeLogin from './components/NormalEmployeeLogin';
import NormalEmployeeSignup from './components/NormalEmployeeSignup';
import SuperEmployeeLogin from './components/SuperEmployeeLogin';
import SuperEmployeeSignup from './components/SuperEmployeeSignup';
import NormalEmployeeDashboard from './components/NormalEmployeeDashboard';
import SuperEmployeeDashboard from './components/SuperEmployeeDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/employee/login" element={<NormalEmployeeLogin />} />
              <Route path="/employee/signup" element={<NormalEmployeeSignup />} />
              <Route path="/super-employee/login" element={<SuperEmployeeLogin />} />
              <Route path="/super-employee/signup" element={<SuperEmployeeSignup />} />
              <Route 
                path="/employee/dashboard" 
                element={
                  <ProtectedRoute requiredRole="employee">
                    <NormalEmployeeDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/super-employee/dashboard" 
                element={
                  <ProtectedRoute requiredRole="super-employee">
                    <SuperEmployeeDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;