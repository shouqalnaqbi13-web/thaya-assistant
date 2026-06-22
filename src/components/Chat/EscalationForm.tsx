import { useState } from 'react';

interface Props {
  onSubmit: (data: { name: string; email: string; phone: string; orderNumber: string }) => void;
  onDismiss: () => void;
}

export default function EscalationForm({ onSubmit, onDismiss }: Props) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', orderNumber: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
  };

  const inputStyle = {
    width: '100%', padding: '8px 10px', border: '1px solid #D4B8B0',
    borderRadius: '8px', fontSize: '13px', fontFamily: 'system-ui, sans-serif',
    backgroundColor: '#fff', color: '#2D2D2D', outline: 'none', boxSizing: 'border-box' as const
  };

  const labelStyle = {
    display: 'block', fontSize: '11px', color: '#8B6B5E',
    marginBottom: '4px', fontWeight: 600, letterSpacing: '0.05em'
  };

  return (
    <div style={{
      margin: '12px 0', padding: '16px', borderRadius: '12px',
      backgroundColor: '#FDF8F6', border: '1px solid #D4B8B0'
    }}>
      <p style={{
        fontSize: '13px', color: '#6C4E44', fontFamily: 'Georgia, serif',
        marginBottom: '12px', lineHeight: '1.5'
      }}>
        Please share your details and our team will get back to you shortly.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label style={labelStyle}>NAME *</label>
          <input
            style={inputStyle} type="text" placeholder="Your name" required
            value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
          />
        </div>
        <div>
          <label style={labelStyle}>EMAIL *</label>
          <input
            style={inputStyle} type="email" placeholder="your@email.com" required
            value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          />
        </div>
        <div>
          <label style={labelStyle}>PHONE (OPTIONAL)</label>
          <input
            style={inputStyle} type="tel" placeholder="+971..."
            value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
          />
        </div>
        <div>
          <label style={labelStyle}>ORDER NUMBER (IF APPLICABLE)</label>
          <input
            style={inputStyle} type="text" placeholder="#1234"
            value={form.orderNumber} onChange={e => setForm(p => ({ ...p, orderNumber: e.target.value }))}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <button
            type="submit" disabled={submitting || !form.name || !form.email}
            style={{
              flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
              backgroundColor: '#6C4E44', color: '#fff', fontSize: '13px',
              fontFamily: 'Georgia, serif', cursor: 'pointer', letterSpacing: '0.05em'
            }}
          >
            {submitting ? 'Sending...' : 'Send to Team'}
          </button>
          <button
            type="button" onClick={onDismiss}
            style={{
              padding: '10px 14px', borderRadius: '8px',
              border: '1px solid #D4B8B0', backgroundColor: '#fff',
              color: '#8B6B5E', fontSize: '13px', cursor: 'pointer'
            }}
          >
            Later
          </button>
        </div>
      </form>
    </div>
  );
}
