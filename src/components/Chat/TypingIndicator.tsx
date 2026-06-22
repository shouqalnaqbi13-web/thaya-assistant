export default function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'flex-start' }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
        backgroundColor: '#A0856D', display: 'flex', alignItems: 'center',
        justifyContent: 'center', marginTop: '2px'
      }}>
        <span style={{ color: '#fff', fontSize: '11px', fontFamily: 'Georgia, serif' }}>L</span>
      </div>
      <div style={{
        padding: '12px 16px', borderRadius: '4px 16px 16px 16px',
        backgroundColor: '#F0EAE8', border: '1px solid #E8DDD8',
        display: 'flex', gap: '4px', alignItems: 'center'
      }}>
        {[0, 1, 2].map(i => (
          <span
            key={i}
            style={{
              width: '6px', height: '6px', borderRadius: '50%',
              backgroundColor: '#A0856D', display: 'inline-block',
              animation: `thaya-bounce 1.2s ease-in-out ${i * 0.2}s infinite`
            }}
          />
        ))}
        <style>{`
          @keyframes thaya-bounce {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-5px); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}
