import { useState } from 'react';
import type { EscalationTicket } from '../../types';

interface Props {
  tickets: EscalationTicket[];
  onUpdateStatus: (id: string, status: EscalationTicket['status']) => void;
}

export default function EscalationInbox({ tickets, onUpdateStatus }: Props) {
  const [selected, setSelected] = useState<EscalationTicket | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');

  const filtered = tickets.filter(t => filter === 'all' || t.status === filter)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const statusColor = (s: string) => ({
    open: '#C0392B', in_progress: '#E67E22', resolved: '#27AE60'
  }[s] || '#8B6B5E');

  const statusLabel = (s: string) => ({
    open: 'Open', in_progress: 'In Progress', resolved: 'Resolved'
  }[s] || s);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'Georgia, serif', color: '#6C4E44', margin: 0, fontSize: '20px' }}>Escalation Inbox</h2>
          <p style={{ color: '#8B6B5E', margin: '4px 0 0', fontSize: '13px' }}>
            {tickets.filter(t => t.status === 'open').length} open tickets requiring attention
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {(['all', 'open', 'in_progress', 'resolved'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px', borderRadius: '20px', border: '1px solid #D4B8B0', cursor: 'pointer',
              backgroundColor: filter === f ? '#6C4E44' : '#fff', color: filter === f ? '#fff' : '#6C4E44',
              fontSize: '13px'
            }}
          >
            {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Ticket list */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', color: '#8B6B5E', padding: '60px 0', fontSize: '14px' }}>
              No tickets in this view.
            </div>
          )}
          {filtered.map(ticket => (
            <div
              key={ticket.id}
              onClick={() => setSelected(selected?.id === ticket.id ? null : ticket)}
              style={{
                backgroundColor: '#fff', border: `1px solid ${selected?.id === ticket.id ? '#8B6B5E' : '#E8DDD8'}`,
                borderRadius: '12px', padding: '16px 20px', cursor: 'pointer',
                transition: 'border-color 0.15s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#2D2D2D', fontSize: '14px' }}>{ticket.customer.name}</div>
                  <div style={{ color: '#8B6B5E', fontSize: '12px' }}>{ticket.customer.email}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
                    backgroundColor: statusColor(ticket.status) + '20', color: statusColor(ticket.status), fontWeight: 600
                  }}>
                    {statusLabel(ticket.status)}
                  </span>
                  <span style={{ fontSize: '11px', color: '#8B6B5E' }}>
                    {new Date(ticket.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div style={{ color: '#555', fontSize: '13px', lineHeight: '1.4' }}>
                {ticket.question.slice(0, 100)}{ticket.question.length > 100 ? '...' : ''}
              </div>
              {ticket.customer.orderNumber && (
                <div style={{ marginTop: '6px', fontSize: '12px', color: '#8B6B5E' }}>
                  Order: {ticket.customer.orderNumber}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Ticket detail */}
        {selected && (
          <div style={{ width: '360px', flexShrink: 0, backgroundColor: '#fff', border: '1px solid #E8DDD8', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', color: '#6C4E44', margin: '0 0 16px', fontSize: '16px' }}>Ticket Detail</h3>

            <div style={{ marginBottom: '16px' }}>
              {[
                { label: 'Name', value: selected.customer.name },
                { label: 'Email', value: selected.customer.email },
                { label: 'Phone', value: selected.customer.phone || '—' },
                { label: 'Order #', value: selected.customer.orderNumber || '—' },
                { label: 'Ticket', value: selected.id }
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', marginBottom: '8px' }}>
                  <span style={{ width: '70px', fontSize: '12px', color: '#8B6B5E', fontWeight: 600 }}>{r.label}</span>
                  <span style={{ fontSize: '13px', color: '#2D2D2D' }}>{r.value}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#FDF8F6', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#8B6B5E', marginBottom: '6px', fontWeight: 600 }}>CUSTOMER QUESTION</div>
              <div style={{ fontSize: '13px', color: '#2D2D2D', lineHeight: '1.5' }}>{selected.question}</div>
            </div>

            {selected.conversationHistory && selected.conversationHistory.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: '#8B6B5E', marginBottom: '8px', fontWeight: 600 }}>CONVERSATION</div>
                <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selected.conversationHistory.map((m, i) => (
                    <div key={i} style={{
                      padding: '8px 10px', borderRadius: '8px', fontSize: '12px', lineHeight: '1.4',
                      backgroundColor: m.role === 'user' ? '#F0EAE8' : '#F5F5F5',
                      color: '#2D2D2D', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%'
                    }}>
                      {m.content}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div style={{ fontSize: '11px', color: '#8B6B5E', marginBottom: '8px', fontWeight: 600 }}>UPDATE STATUS</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['open', 'in_progress', 'resolved'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => onUpdateStatus(selected.id, s)}
                    style={{
                      flex: 1, padding: '8px 4px', borderRadius: '6px', border: '1px solid #D4B8B0',
                      backgroundColor: selected.status === s ? '#6C4E44' : '#fff',
                      color: selected.status === s ? '#fff' : '#6C4E44',
                      fontSize: '11px', cursor: 'pointer'
                    }}
                  >
                    {statusLabel(s)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
