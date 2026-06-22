import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ChatWidget from './components/Chat/ChatWidget';
import AdminDashboard from './components/Admin/AdminDashboard';

function CustomerPage() {
  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#FAF6F4',
      fontFamily: 'Georgia, serif', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center'
    }}>
      {/* Demo page header */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '16px 32px', backgroundColor: '#6C4E44', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 40 }}>
        <span style={{ color: '#fff', fontSize: '22px', letterSpacing: '0.15em' }}>THAYA</span>
        <Link to="/admin" style={{ color: '#D4B8B0', fontSize: '12px', textDecoration: 'none', letterSpacing: '0.08em' }}>
          Admin →
        </Link>
      </div>

      {/* Demo content */}
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ color: '#A0856D', fontSize: '12px', letterSpacing: '0.2em', marginBottom: '16px' }}>
          CUSTOMER SERVICE ASSISTANT
        </div>
        <h1 style={{ color: '#6C4E44', fontSize: '32px', fontWeight: 400, marginBottom: '16px', letterSpacing: '0.05em' }}>
          Dreams Made of Fabric
        </h1>
        <p style={{ color: '#8B6B5E', fontSize: '15px', maxWidth: '440px', lineHeight: '1.7', marginBottom: '40px' }}>
          Meet Layla — THAYA's customer service assistant. She can help with product questions,
          sizing, shipping, returns, and more.
        </p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '12px 20px', borderRadius: '12px', backgroundColor: '#F0EAE8',
          color: '#6C4E44', fontSize: '13px'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Tap "Ask THAYA" in the bottom right corner to start
        </div>
      </div>

      {/* The chat widget */}
      <ChatWidget />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
