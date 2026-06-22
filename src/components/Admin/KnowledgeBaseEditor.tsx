import { useState } from 'react';
import type { KnowledgeBase } from '../../types';
import { updatePolicy } from '../../lib/knowledge-base';

interface Props { kb: KnowledgeBase; onUpdate: (kb: KnowledgeBase) => void }

const POLICY_LABELS: Record<string, string> = {
  shipping: 'Shipping Policy',
  returns: 'Return & Exchange Policy',
  privacy: 'Privacy Policy',
  faq_general: 'General FAQ Content'
};

export default function KnowledgeBaseEditor({ kb, onUpdate }: Props) {
  const [activePolicy, setActivePolicy] = useState<string>('shipping');
  const [content, setContent] = useState(kb.policies[activePolicy] || '');
  const [saved, setSaved] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [addingNew, setAddingNew] = useState(false);

  const handleSwitch = (key: string) => {
    setActivePolicy(key);
    setContent(kb.policies[key] || '');
    setSaved(false);
  };

  const handleSave = () => {
    const updated = updatePolicy(kb, activePolicy, content);
    onUpdate(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddNew = () => {
    if (!newKey.trim()) return;
    const key = newKey.toLowerCase().replace(/\s+/g, '_');
    const updated = updatePolicy(kb, key, '');
    onUpdate(updated);
    setNewKey('');
    setAddingNew(false);
    handleSwitch(key);
  };

  const allPolicies = Object.keys(kb.policies);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'Georgia, serif', color: '#6C4E44', margin: 0, fontSize: '20px' }}>Policies & Content</h2>
          <p style={{ color: '#8B6B5E', margin: '4px 0 0', fontSize: '13px' }}>
            Layla searches this content before answering policy questions
          </p>
        </div>
        <button
          onClick={() => setAddingNew(true)}
          style={{ padding: '10px 18px', backgroundColor: '#6C4E44', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}
        >
          + New Section
        </button>
      </div>

      {addingNew && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <input
            style={{ flex: 1, padding: '10px 12px', border: '1px solid #D4B8B0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
            placeholder="e.g. Custom Orders Policy"
            value={newKey} onChange={e => setNewKey(e.target.value)}
          />
          <button onClick={handleAddNew} style={{ padding: '10px 16px', backgroundColor: '#6C4E44', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Add</button>
          <button onClick={() => setAddingNew(false)} style={{ padding: '10px 14px', border: '1px solid #D4B8B0', backgroundColor: '#fff', color: '#6C4E44', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Sidebar */}
        <div style={{ width: '200px', flexShrink: 0 }}>
          {allPolicies.map(key => (
            <button
              key={key}
              onClick={() => handleSwitch(key)}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px',
                marginBottom: '4px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                backgroundColor: activePolicy === key ? '#F0EAE8' : 'transparent',
                color: activePolicy === key ? '#6C4E44' : '#555',
                fontWeight: activePolicy === key ? 600 : 400, fontSize: '13px'
              }}
            >
              {POLICY_LABELS[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div style={{ flex: 1 }}>
          <div style={{ backgroundColor: '#fff', border: '1px solid #E8DDD8', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, color: '#6C4E44', fontFamily: 'Georgia, serif', fontSize: '16px' }}>
                {POLICY_LABELS[activePolicy] || activePolicy}
              </h3>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {saved && <span style={{ color: '#6C4E44', fontSize: '13px' }}>✓ Saved</span>}
                <button
                  onClick={handleSave}
                  style={{ padding: '8px 18px', backgroundColor: '#6C4E44', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}
                >
                  Save
                </button>
              </div>
            </div>
            <p style={{ color: '#8B6B5E', fontSize: '12px', marginBottom: '12px' }}>
              Write your policy in plain text. Layla will read and summarize this for customers.
            </p>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={20}
              style={{
                width: '100%', padding: '14px', border: '1px solid #D4B8B0', borderRadius: '8px',
                fontSize: '13px', fontFamily: 'system-ui, sans-serif', lineHeight: '1.7',
                color: '#2D2D2D', outline: 'none', resize: 'vertical', boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
