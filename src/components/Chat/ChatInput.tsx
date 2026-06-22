import { useState, useRef, type KeyboardEvent } from 'react';

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const QUICK_REPLIES = [
  'What fabric is this made from?',
  'Does it include a shaila?',
  'What size should I choose?',
  'Do you ship internationally?',
  'What is your return policy?'
];

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue('');
    setShowQuickReplies(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (text: string) => {
    onSend(text);
    setShowQuickReplies(false);
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  };

  return (
    <div>
      {/* Quick reply chips */}
      {showQuickReplies && !disabled && (
        <div style={{ padding: '8px 12px 0', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {QUICK_REPLIES.map(r => (
            <button
              key={r}
              onClick={() => handleQuickReply(r)}
              style={{
                padding: '5px 10px', borderRadius: '20px', fontSize: '12px',
                border: '1px solid #D4B8B0', backgroundColor: '#fff',
                color: '#6C4E44', cursor: 'pointer', fontFamily: 'system-ui, sans-serif',
                transition: 'all 0.15s', whiteSpace: 'nowrap'
              }}
              onMouseEnter={e => {
                (e.target as HTMLButtonElement).style.backgroundColor = '#F0EAE8';
              }}
              onMouseLeave={e => {
                (e.target as HTMLButtonElement).style.backgroundColor = '#fff';
              }}
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div style={{ padding: '12px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          disabled={disabled}
          placeholder={disabled ? 'Our team will be in touch shortly.' : 'Ask Layla anything...'}
          rows={1}
          style={{
            flex: 1, resize: 'none', border: '1px solid #D4B8B0', borderRadius: '12px',
            padding: '10px 14px', fontSize: '14px', fontFamily: 'system-ui, sans-serif',
            backgroundColor: disabled ? '#F5EDE9' : '#fff', color: '#2D2D2D',
            outline: 'none', lineHeight: '1.4', maxHeight: '100px',
            transition: 'border-color 0.15s'
          }}
          onFocus={e => { e.target.style.borderColor = '#8B6B5E'; }}
          onBlur={e => { e.target.style.borderColor = '#D4B8B0'; }}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          style={{
            width: '38px', height: '38px', borderRadius: '50%', border: 'none',
            backgroundColor: disabled || !value.trim() ? '#C8A89A' : '#6C4E44',
            color: '#fff', cursor: disabled || !value.trim() ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'background-color 0.15s'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
