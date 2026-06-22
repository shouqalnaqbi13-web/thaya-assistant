import { useState, useRef, useEffect } from 'react';
import { useChatSession, useEscalation } from '../../store';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import EscalationForm from './EscalationForm';

export default function ChatWidget() {
  const { messages, sendMessage, isLoading, isEscalated, saveSession } = useChatSession();
  const { submitTicket } = useEscalation();
  const [isOpen, setIsOpen] = useState(false);
  const [showEscalation, setShowEscalation] = useState(false);
  const [escalationSubmitted, setEscalationSubmitted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isEscalated && !showEscalation && !escalationSubmitted) {
      setTimeout(() => setShowEscalation(true), 1500);
    }
  }, [isEscalated, showEscalation, escalationSubmitted]);

  const handleClose = () => {
    saveSession();
    setIsOpen(false);
  };

  const handleEscalationSubmit = async (data: {
    name: string; email: string; phone: string; orderNumber: string;
  }) => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    await submitTicket({
      ...data,
      question: lastUserMessage?.content || 'Customer requested assistance',
      conversationHistory: messages
    });
    setShowEscalation(false);
    setEscalationSubmitted(true);
  };

  return (
    <>
      {/* Chat bubble */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-lg transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        style={{ backgroundColor: '#6C4E44', color: '#fff' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: '14px', letterSpacing: '0.05em' }}>
          Ask THAYA
        </span>
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden"
          style={{ width: '380px', height: '600px', backgroundColor: '#FDFAF8' }}
        >
          {/* Header */}
          <div style={{ backgroundColor: '#6C4E44', padding: '16px 20px' }} className="flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: '#A0856D', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'Georgia, serif' }}>L</span>
              </div>
              <div>
                <div style={{ color: '#fff', fontFamily: 'Georgia, serif', fontSize: '15px', fontWeight: 600 }}>Layla</div>
                <div style={{ color: '#D4B8B0', fontSize: '12px' }}>THAYA Customer Service</div>
              </div>
            </div>
            <button onClick={handleClose} style={{ color: '#D4B8B0', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto" style={{ padding: '16px', backgroundColor: '#FDFAF8' }}>
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}

            {escalationSubmitted && (
              <div style={{
                margin: '12px 0', padding: '14px 16px', borderRadius: '12px',
                backgroundColor: '#F0EAE8', border: '1px solid #D4B8B0'
              }}>
                <p style={{ color: '#6C4E44', fontSize: '13px', fontFamily: 'Georgia, serif', margin: 0, lineHeight: '1.6' }}>
                  Thank you. Our team will be in touch within 24 hours at the email you provided.
                </p>
              </div>
            )}

            {showEscalation && !escalationSubmitted && (
              <EscalationForm onSubmit={handleEscalationSubmit} onDismiss={() => setShowEscalation(false)} />
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ borderTop: '1px solid #E8DDD8', backgroundColor: '#FDFAF8' }}>
            <ChatInput onSend={sendMessage} disabled={isLoading || escalationSubmitted} />
          </div>

          {/* Footer */}
          <div style={{ backgroundColor: '#F5EDE9', padding: '8px 16px', textAlign: 'center' }}>
            <span style={{ color: '#A0856D', fontSize: '11px', letterSpacing: '0.08em' }}>
              THAYA · hello@thaya.ae
            </span>
          </div>
        </div>
      )}
    </>
  );
}
