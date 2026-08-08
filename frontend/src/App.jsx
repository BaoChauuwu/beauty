import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { DoctorHeaderCard } from './components/DoctorHeaderCard';
import { CalendarBookingView } from './components/CalendarBookingView';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorCalendarDashboard } from './components/DoctorCalendarDashboard';
import { AuthModal } from './components/AuthModal';

const GOOGLE_CLIENT_ID = '527045395501-hvns1aibi5i75bl884u31ope2i4b4gg1.apps.googleusercontent.com';

export function AppContent() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    fetch('/api/doctors')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) setDoctor(data[0]);
      })
      .catch((err) => console.error('Error fetching doctor profile:', err));
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        onNavigate={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <main className="container" style={{ flex: 1, padding: '20px 12px 60px', width: '100%', maxWidth: '100vw' }}>
        {activeTab === 'calendar' && (
          <>
            <DoctorHeaderCard doctor={doctor} />
            <CalendarBookingView
              doctor={doctor}
              onOpenAuth={() => setIsAuthOpen(true)}
              onBookingSuccess={() => {
                setActiveTab('lookup');
              }}
            />
          </>
        )}

        {activeTab === 'lookup' && (
          <PatientDashboard onOpenBooking={() => setActiveTab('calendar')} />
        )}

        {activeTab === 'admin' && <DoctorCalendarDashboard />}
      </main>

      {/* Auth Modal (Email & Google Auth) */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
