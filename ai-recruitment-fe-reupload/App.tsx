// import React, { useEffect } from 'react';
// import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { useAuthStore } from './store/useAuthStore';

// // Common Pages
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import Header from './components/common/Header';

// // Candidate Pages & Layout
// import CandidateLayout from './layout/CandidateLayout';
// import DashboardPage from './pages/DashboardPage';
// import JobBoardPage from './pages/JobBoardPage';
// import NotificationPage from './pages/NotificationPage';
// import HistoryPage from './pages/HistoryPage';

// // HRD Pages & Layout
// import HrdLayout from './layout/HrdLayout';
// import DashboardHrd from './pages/hrd/DashboardHrd';
// import MatchingEngine from './pages/hrd/MatchingEngine';
// import CandidateRanking from './pages/hrd/CandidateRanking';
// import GapAnalysis from './pages/hrd/GapAnalysis';
// import SettingsPage from './pages/hrd/Settings';
// import NotificationCenter from './pages/hrd/NotificationCenter';
// import CandidateList from './pages/hrd/CandidateList';
// import CandidateDetailPage from './pages/hrd/CandidateDetailPage';
// import JobManagement from './pages/hrd/JobManagement';
// import JobFormPage from './pages/hrd/JobFormPage';
// import JobDetailPage from './pages/hrd/JobDetailPage';

// const App: React.FC = () => {
//   const { isAuthenticated, user } = useAuthStore();
//   // const { isAuthenticated, user, checkAuth } = useAuthStore();
//   const location = useLocation();

//   // useEffect(() => {
//   //   checkAuth();
//   // }, [checkAuth]);

//   const showHeader = isAuthenticated && location.pathname !== '/login' && location.pathname !== '/register';

//   return (
//     <div className="min-h-screen flex flex-col">
//       {showHeader && <Header />}
//       <main className={`flex-grow ${showHeader ? 'pt-16' : ''}`}>
//         <Routes>
//           {/* Auth Routes */}
//           <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
//           <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} />

//           {/* Candidate Routes with Sidebar Layout */}
//           <Route path="/" element={<ProtectedRoute role="candidate"><CandidateLayout /></ProtectedRoute>}>
//               <Route index element={<Navigate to="/dashboard" replace />} />
//               <Route path="dashboard" element={<DashboardPage />} />
//               <Route path="jobs" element={<JobBoardPage />} />
//               <Route path="history" element={<HistoryPage />} />
//               <Route path="notifications" element={<NotificationPage />} />
//           </Route>

//           {/* HRD Routes */}
//           <Route path="/hrd" element={<ProtectedRoute role="hrd"><HrdLayout /></ProtectedRoute>}>
//             <Route index element={<Navigate to="/hrd/dashboard" replace />} />
//             <Route path="dashboard" element={<DashboardHrd />} />
//             <Route path="jobs" element={<JobManagement />} />
//             <Route path="jobs/new" element={<JobFormPage />} />
//             <Route path="jobs/:id" element={<JobDetailPage />} />
//             <Route path="jobs/:id/edit" element={<JobFormPage />} />
//             <Route path="matching" element={<MatchingEngine />} />
//             <Route path="ranking" element={<CandidateRanking />} />
//             <Route path="gap-analysis" element={<GapAnalysis />} />
//             <Route path="kandidat" element={<CandidateList />} />
//             <Route path="kandidat/:id" element={<CandidateDetailPage />} />
//             <Route path="settings" element={<SettingsPage />} />
//             <Route path="notifications" element={<NotificationCenter />} />
//           </Route>

//           {/* Root Navigation */}
//           <Route path="/" element={
//             <Navigate to={
//               isAuthenticated 
//                 ? (user?.role === 'hrd' ? "/hrd/dashboard" : "/dashboard") 
//                 : "/login"
//             } />
//           }/>
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </main>
//     </div>
//   );
// };

// interface ProtectedRouteProps {
//   role: 'candidate' | 'hrd';
//   children: React.ReactElement;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, children }) => {
//   const { isAuthenticated, user } = useAuthStore();
  
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (user?.role !== role) {
//     // If wrong role, redirect to their correct dashboard or login
//     const correctDashboard = user?.role === 'hrd' ? '/hrd/dashboard' : '/dashboard';
//     return <Navigate to={correctDashboard} replace />;
//   }

//   return children;
// };

// export default App;

import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';

// Common Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Header from './components/common/Header';

// Candidate Pages & Layout
import CandidateLayout from './layout/CandidateLayout';
import DashboardPage from './pages/DashboardPage';
import JobBoardPage from './pages/JobBoardPage';
import NotificationPage from './pages/NotificationPage';
import HistoryPage from './pages/HistoryPage';

// HRD Pages & Layout
import HrdLayout from './layout/HrdLayout';
import DashboardHrd from './pages/hrd/DashboardHrd';
import MatchingEngine from './pages/hrd/MatchingEngine';
import CandidateRanking from './pages/hrd/CandidateRanking';
import GapAnalysis from './pages/hrd/GapAnalysis';
import SettingsPage from './pages/hrd/Settings';
import NotificationCenter from './pages/hrd/NotificationCenter';
import CandidateList from './pages/hrd/CandidateList';
import CandidateDetailPage from './pages/hrd/CandidateDetailPage';
import JobManagement from './pages/hrd/JobManagement';
import JobFormPage from './pages/hrd/JobFormPage';
import JobDetailPage from './pages/hrd/JobDetailPage';

const App: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  const showHeader =
    isAuthenticated &&
    location.pathname !== '/login' &&
    location.pathname !== '/register';

  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header />}
      <main className={`flex-grow ${showHeader ? 'pt-16' : ''}`}>
        <Routes>

          {/* Auth Routes */}
          <Route
            path="/login"
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" replace />}
          />

          {/* Root Redirect */}
          <Route
            path="/"
            element={
              <Navigate
                to={
                  isAuthenticated
                    ? user?.role === 'hrd'
                      ? '/hrd/dashboard'
                      : '/dashboard'
                    : '/login'
                }
                replace
              />
            }
          />

          {/* Candidate Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute role="candidate">
                <CandidateLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="jobs" element={<JobBoardPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="notifications" element={<NotificationPage />} />
          </Route>

          {/* HRD Routes */}
          <Route
            path="/hrd"
            element={
              <ProtectedRoute role="hrd">
                <HrdLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardHrd />} />
            <Route path="jobs" element={<JobManagement />} />
            <Route path="jobs/new" element={<JobFormPage />} />
            <Route path="jobs/:id" element={<JobDetailPage />} />
            <Route path="jobs/:id/edit" element={<JobFormPage />} />
            <Route path="matching" element={<MatchingEngine />} />
            <Route path="ranking" element={<CandidateRanking />} />
            <Route path="gap-analysis" element={<GapAnalysis />} />
            <Route path="kandidat" element={<CandidateList />} />
            <Route path="kandidat/:id" element={<CandidateDetailPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="notifications" element={<NotificationCenter />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </main>
    </div>
  );
};

interface ProtectedRouteProps {
  role: 'candidate' | 'hrd';
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== role) {
    return (
      <Navigate
        to={user?.role === 'hrd' ? '/hrd/dashboard' : '/dashboard'}
        replace
      />
    );
  }

  return children;
};

export default App;
