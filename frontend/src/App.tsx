import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { VehicleProvider } from './context/VehicleContext';
import { AppLayout } from './components/layout/AppLayout';

import { LandingPage } from './pages/Landing/LandingPage';
import { Login } from './pages/Authentication/Login';
import { Register } from './pages/Authentication/Register';
import { ForgotPassword } from './pages/Authentication/ForgotPassword';

import { DashboardPage } from './pages/Overview/DashboardPage';
import { UploadPage } from './pages/CSVUpload/UploadPage';
import { EngineAnalyticsPage } from './pages/EngineAnalytics/EngineAnalyticsPage';
import { StatisticalEnginePage } from './pages/StatisticalEngine/StatisticalEnginePage';
import { TripSimulationPage } from './pages/TripSimulation/TripSimulationPage';
import { MileageAnalyticsPage } from './pages/Mileage/MileageAnalyticsPage';

import { ElectricalPage } from './pages/Electrical/ElectricalPage';
import { DiagnosticsPage } from './pages/Diagnostics/DiagnosticsPage';
import { MaintenancePage } from './pages/Maintenance/MaintenancePage';
import { RecommendationsPage } from './pages/Recommendations/RecommendationsPage';
import { FinancialPage } from './pages/Financial/FinancialPage';
import { ReportsPage } from './pages/Reports/ReportsPage';
import { VehicleProfilePage } from './pages/VehicleProfile/VehicleProfilePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1D1D1D]">
        <div className="w-8 h-8 border-2 border-[#A5A78F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VehicleProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected App Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/engine" element={<EngineAnalyticsPage />} />
              <Route path="/engine/statistics" element={<StatisticalEnginePage />} />
              <Route path="/trip-simulator" element={<TripSimulationPage />} />
              <Route path="/mileage-analysis" element={<MileageAnalyticsPage />} />
              <Route path="/electrical" element={<ElectricalPage />} />
              <Route path="/diagnostics" element={<DiagnosticsPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/financial" element={<FinancialPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/vehicles" element={<VehicleProfilePage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </VehicleProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
