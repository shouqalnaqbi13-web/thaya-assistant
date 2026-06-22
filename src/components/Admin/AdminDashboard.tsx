import { useState } from 'react';
import FAQEditor from './FAQEditor';
import KnowledgeBaseEditor from './KnowledgeBaseEditor';
import EscalationInbox from './EscalationInbox';
import AnalyticsPanel from './Analytics';
import { useKnowledgeBase, useEscalation, useAnalytics } from '../../store';

type Tab = 'faqs' | 'policies' | 'escalations' | 'analytics' | 'settings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('faqs');
  const { kb, update } = useKnowledgeBase();
  const { tickets, updateTicketStatus } = useEscalation();
  const analytics = useAnalytics();

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'faqs', label: 'FAQs', count: kb.faqs.length },
    { id: 'policies', label: 'Policies & Content' },
    { id: 'escalations', label: 'Escalations', count: tickets.filter(t => t.status === 'open').length },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAF6F4', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#6C4E44', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'Georgia, serif', color: '#fff', fontSize: '20px', letterSpacing: '0.1em' }}>
            THAYA
          </div>
          <div style={{ color: '#D4B8B0', fontSize: '12px', letterSpacing: '0.08em' }}>
            Customer Service Assistant — Admin
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ color: '#D4B8B0', fontSize: '12px' }}>
            Last updated: {new Date(kb.updatedAt).toLocaleDateString()}
          </span>
          <a href="/" style={{
            padding: '8px 16px', borderRadius: '8px', border: '1px solid #D4B8B0',
            color: '#fff', fontSize: '13px', textDecoration: 'none'
          }}>
            View Chatbot
          </a>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ backgroundColor: '#F5EDE9', borderBottom: '1px solid #E8DDD8', padding: '12px 32px', display: 'flex', gap: '32px' }}>
        {[
          { label: 'Total FAQs', value: kb.faqs.length },
          { label: 'Open Tickets', value: tickets.filter(t => t.status === 'open').length },
          { label: 'Total Messages', value: analytics.totalMessages || 0 },
          { label: 'Policy Sections', value: Object.keys(kb.policies).length }
        ].map(s => (
          <div key={s.label}>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#6C4E44' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#8B6B5E', letterSpacing: '0.05em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #E8DDD8', padding: '0 32px', display: 'flex', gap: '0' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '14px 20px', border: 'none', borderBottom: activeTab === tab.id ? '2px solid #6C4E44' : '2px solid transparent',
              backgroundColor: 'transparent', color: activeTab === tab.id ? '#6C4E44' : '#8B6B5E',
              fontSize: '14px', cursor: 'pointer', fontWeight: activeTab === tab.id ? 600 : 400,
              display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span style={{
                backgroundColor: tab.id === 'escalations' && tab.count > 0 ? '#C0392B' : '#8B6B5E',
                color: '#fff', borderRadius: '10px', padding: '1px 7px', fontSize: '11px'
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
        {activeTab === 'faqs' && <FAQEditor kb={kb} onUpdate={update} />}
        {activeTab === 'policies' && <KnowledgeBaseEditor kb={kb} onUpdate={update} />}
        {activeTab === 'escalations' && <EscalationInbox tickets={tickets} onUpdateStatus={updateTicketStatus} />}
        {activeTab === 'analytics' && <AnalyticsPanel analytics={analytics} />}
        {activeTab === 'settings' && <SettingsPanel kb={kb} onUpdate={update} />}
      </div>
    </div>
  );
}

function SettingsPanel({ kb, onUpdate }: { kb: import('../../types').KnowledgeBase; onUpdate: (kb: import('../../types').KnowledgeBase) => void }) {
  const [greeting, setGreeting] = useState(kb.customResponses.greeting || '');
  const [email, setEmail] = useState(kb.storeInfo.email || '');
  const [phone, setPhone] = useState(kb.storeInfo.phone || '');
  const [whatsapp, setWhatsapp] = useState(kb.storeInfo.whatsapp || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const updated = {
      ...kb,
      customResponses: { ...kb.customResponses, greeting },
      storeInfo: { ...kb.storeInfo, email, phone, whatsapp }
    };
    onUpdate(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', border: '1px solid #D4B8B0', borderRadius: '8px',
    fontSize: '14px', fontFamily: 'system-ui, sans-serif', color: '#2D2D2D', outline: 'none',
    backgroundColor: '#fff', boxSizing: 'border-box' as const
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <h2 style={{ fontFamily: 'Georgia, serif', color: '#6C4E44', marginBottom: '24px', fontSize: '20px' }}>Settings</h2>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #E8DDD8', marginBottom: '20px' }}>
        <h3 style={{ color: '#6C4E44', fontSize: '15px', marginBottom: '16px', fontFamily: 'Georgia, serif' }}>Chatbot Greeting</h3>
        <label style={{ fontSize: '12px', color: '#8B6B5E', display: 'block', marginBottom: '6px' }}>OPENING MESSAGE</label>
        <textarea rows={4} style={inputStyle} value={greeting} onChange={e => setGreeting(e.target.value)} />
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #E8DDD8', marginBottom: '20px' }}>
        <h3 style={{ color: '#6C4E44', fontSize: '15px', marginBottom: '16px', fontFamily: 'Georgia, serif' }}>Contact Information</h3>
        {[
          { label: 'EMAIL', value: email, set: setEmail },
          { label: 'PHONE', value: phone, set: setPhone },
          { label: 'WHATSAPP', value: whatsapp, set: setWhatsapp }
        ].map(f => (
          <div key={f.label} style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', color: '#8B6B5E', display: 'block', marginBottom: '6px' }}>{f.label}</label>
            <input style={inputStyle} value={f.value} onChange={e => f.set(e.target.value)} />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        style={{
          padding: '12px 28px', backgroundColor: '#6C4E44', color: '#fff', border: 'none',
          borderRadius: '8px', fontSize: '14px', fontFamily: 'Georgia, serif', cursor: 'pointer', letterSpacing: '0.05em'
        }}
      >
        {saved ? '✓ Saved' : 'Save Settings'}
      </button>
    </div>
  );
}
