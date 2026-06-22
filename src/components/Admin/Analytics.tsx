import type { Analytics } from '../../types';

export default function AnalyticsPanel({ analytics }: { analytics: Analytics }) {
  const topIntents = Object.entries(analytics.topIntents || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const intentLabels: Record<string, string> = {
    product_fabric: 'Fabric Questions',
    product_shaila: 'Shaila Questions',
    sizing: 'Sizing',
    pricing: 'Pricing',
    order_status: 'Order Status',
    shipping: 'Shipping',
    returns: 'Returns',
    payment: 'Payment',
    store_location: 'Store Location',
    contact: 'Contact',
    availability: 'Product Availability',
    product_details: 'Product Details',
    general: 'General'
  };

  const total = topIntents.reduce((sum, [, v]) => sum + v, 0) || 1;

  return (
    <div>
      <h2 style={{ fontFamily: 'Georgia, serif', color: '#6C4E44', marginBottom: '24px', fontSize: '20px' }}>Analytics</h2>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Messages', value: analytics.totalMessages || 0 },
          { label: 'Total Conversations', value: analytics.totalConversations || 0 },
          { label: 'Escalations', value: analytics.escalations || 0 }
        ].map(s => (
          <div key={s.label} style={{
            backgroundColor: '#fff', border: '1px solid #E8DDD8', borderRadius: '12px',
            padding: '20px 24px'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#6C4E44', fontFamily: 'Georgia, serif' }}>
              {s.value}
            </div>
            <div style={{ fontSize: '13px', color: '#8B6B5E', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Top intents */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #E8DDD8', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ fontFamily: 'Georgia, serif', color: '#6C4E44', margin: '0 0 20px', fontSize: '16px' }}>
          Most Common Customer Questions
        </h3>
        {topIntents.length === 0 ? (
          <p style={{ color: '#8B6B5E', fontSize: '14px' }}>No data yet — conversations will appear here once customers start chatting.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topIntents.map(([intent, count]) => (
              <div key={intent}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', color: '#2D2D2D' }}>{intentLabels[intent] || intent}</span>
                  <span style={{ fontSize: '13px', color: '#8B6B5E', fontWeight: 600 }}>{count}</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#F0EAE8', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: '3px', backgroundColor: '#8B6B5E',
                    width: `${(count / total) * 100}%`, transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
