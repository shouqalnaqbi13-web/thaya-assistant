import type { Message } from '../../types';

interface Props { message: Message }

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';

  // Convert newlines and basic markdown-style formatting
  const formatContent = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
        <div style={{
          maxWidth: '75%', padding: '10px 14px', borderRadius: '16px 16px 4px 16px',
          backgroundColor: '#6C4E44', color: '#fff',
          fontSize: '14px', lineHeight: '1.5', fontFamily: 'system-ui, sans-serif'
        }}>
          {formatContent(message.content)}
        </div>
      </div>
    );
  }

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
        maxWidth: '78%', padding: '10px 14px', borderRadius: '4px 16px 16px 16px',
        backgroundColor: '#F0EAE8', color: '#2D2D2D',
        fontSize: '14px', lineHeight: '1.6', fontFamily: 'system-ui, sans-serif',
        border: '1px solid #E8DDD8'
      }}>
        {formatContent(message.content)}
        {message.isEscalation && (
          <div style={{
            marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #D4B8B0',
            fontSize: '12px', color: '#8B6B5E', fontStyle: 'italic'
          }}>
            Connecting you with our team...
          </div>
        )}
      </div>
    </div>
  );
}
