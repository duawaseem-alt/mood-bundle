import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/landingpage.jsx';
import Login from './components/login.jsx';
import Signup from './components/signup.jsx';
import ProtectedRoute from './components/protectedroute.jsx';
import QuickLogin from './components/quicklogin.jsx';
import Navbar from './components/navbar.jsx';

// All dashboard components
import MoodBox from './components/moodbox.jsx';
import SpotifySongsBox from './components/moodsongs.jsx';
import MoodClinical from './components/moodclinical.jsx';
// import DashboardSummary from './components/usermoodchart.jsx';
import EmergencyDashboard from './components/emerdb.jsx';
import DashboardHistory from './components/usermoodchart.jsx';

// "Homepage" is now basically all dashboards together
function Homepage() {
  return (
    <>
    <Navbar/>
      <MoodBox />
      <SpotifySongsBox />
      <MoodClinical />
      <DashboardHistory />
      <EmergencyDashboard />
    </>
  );
}

function App() {
  return (
    <>
      {/* Navbar always visible */}
      
      {/* <QuickLogin /> */}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* All dashboards */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          }
        />

        {/* Only first dashboard */}
        <Route
          path="/logmoods"
          element={
            <ProtectedRoute>
              <Navbar/>
              <MoodBox />
            </ProtectedRoute>
          }
        />

        {/* Only playlist dashboard */}
        <Route
          path="/playlist"
          element={
            <ProtectedRoute>
              <Navbar/>
              <SpotifySongsBox />
            </ProtectedRoute>
          }
        />

        {/* Only mood clinical */}
        <Route
          path="/yourcycle"
          element={
            <ProtectedRoute>
              <Navbar/>
              <MoodClinical />
            </ProtectedRoute>
          }
        />
<Route
          path="/graph"
          element={
            <ProtectedRoute>
              <Navbar/>
              <DashboardHistory />
            </ProtectedRoute>
          }
        />

        {/* Only emergency dashboard */}
        <Route
          path="/upgrade"
          element={
            <ProtectedRoute>
              <Navbar/>
              <EmergencyDashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
