import { useState } from 'react';
import type { KnowledgeBase, FAQ } from '../../types';
import { addFAQ, updateFAQ, deleteFAQ } from '../../lib/knowledge-base';

interface Props { kb: KnowledgeBase; onUpdate: (kb: KnowledgeBase) => void }

const CATEGORIES = ['Product', 'Sizing', 'Shipping', 'Returns', 'Payment', 'Store', 'General'];

export default function FAQEditor({ kb, onUpdate }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState('');
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '', category: 'General' });
  const [saved, setSaved] = useState<string | null>(null);

  const filtered = kb.faqs.filter(f =>
    !filter || f.category === filter || f.question.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAdd = () => {
    if (!newFAQ.question || !newFAQ.answer) return;
    const updated = addFAQ(kb, newFAQ);
    onUpdate(updated);
    setNewFAQ({ question: '', answer: '', category: 'General' });
    setIsAdding(false);
    flash('added');
  };

  const handleUpdate = (id: string, updates: Partial<FAQ>) => {
    onUpdate(updateFAQ(kb, id, updates));
    setEditingId(null);
    flash('saved');
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this FAQ?')) onUpdate(deleteFAQ(kb, id));
  };

  const flash = (msg: string) => {
    setSaved(msg);
    setTimeout(() => setSaved(null), 2000);
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', border: '1px solid #D4B8B0', borderRadius: '8px',
    fontSize: '14px', fontFamily: 'system-ui, sans-serif', color: '#2D2D2D', outline: 'none',
    backgroundColor: '#fff', boxSizing: 'border-box' as const
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'Georgia, serif', color: '#6C4E44', margin: 0, fontSize: '20px' }}>FAQ Editor</h2>
          <p style={{ color: '#8B6B5E', margin: '4px 0 0', fontSize: '13px' }}>
            {kb.faqs.length} FAQs — searched by Layla before every response
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {saved && <span style={{ color: '#6C4E44', fontSize: '13px' }}>✓ {saved}</span>}
          <button
            onClick={() => setIsAdding(true)}
            style={{
              padding: '10px 18px', backgroundColor: '#6C4E44', color: '#fff', border: 'none',
              borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'Georgia, serif'
            }}
          >
            + Add FAQ
          </button>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilter('')}
          style={{
            padding: '6px 14px', borderRadius: '20px', border: '1px solid #D4B8B0',
            backgroundColor: !filter ? '#6C4E44' : '#fff', color: !filter ? '#fff' : '#6C4E44',
            fontSize: '12px', cursor: 'pointer'
          }}
        >All</button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '6px 14px', borderRadius: '20px', border: '1px solid #D4B8B0',
              backgroundColor: filter === cat ? '#6C4E44' : '#fff', color: filter === cat ? '#fff' : '#6C4E44',
              fontSize: '12px', cursor: 'pointer'
            }}
          >{cat}</button>
        ))}
      </div>

      {/* Add form */}
      {isAdding && (
        <div style={{ backgroundColor: '#FDF8F6', border: '1px solid #D4B8B0', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: '#6C4E44', fontFamily: 'Georgia, serif', margin: '0 0 16px' }}>New FAQ</h3>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', color: '#8B6B5E', display: 'block', marginBottom: '4px' }}>CATEGORY</label>
            <select style={inputStyle} value={newFAQ.category} onChange={e => setNewFAQ(p => ({ ...p, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', color: '#8B6B5E', display: 'block', marginBottom: '4px' }}>QUESTION</label>
            <input style={inputStyle} placeholder="What does the customer ask?" value={newFAQ.question} onChange={e => setNewFAQ(p => ({ ...p, question: e.target.value }))} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: '#8B6B5E', display: 'block', marginBottom: '4px' }}>ANSWER</label>
            <textarea style={inputStyle} rows={4} placeholder="THAYA's answer..." value={newFAQ.answer} onChange={e => setNewFAQ(p => ({ ...p, answer: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleAdd} style={{ padding: '10px 20px', backgroundColor: '#6C4E44', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>Add FAQ</button>
            <button onClick={() => setIsAdding(false)} style={{ padding: '10px 16px', border: '1px solid #D4B8B0', backgroundColor: '#fff', color: '#6C4E44', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* FAQ list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map(faq => (
          <FAQRow
            key={faq.id} faq={faq}
            isEditing={editingId === faq.id}
            onEdit={() => setEditingId(faq.id)}
            onSave={(updates) => handleUpdate(faq.id, updates)}
            onCancel={() => setEditingId(null)}
            onDelete={() => handleDelete(faq.id)}
            inputStyle={inputStyle}
          />
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: '#8B6B5E', padding: '40px', fontSize: '14px' }}>
            No FAQs found. Add your first one above.
          </div>
        )}
      </div>
    </div>
  );
}

function FAQRow({ faq, isEditing, onEdit, onSave, onCancel, onDelete, inputStyle }: {
  faq: FAQ; isEditing: boolean;
  onEdit: () => void; onSave: (u: Partial<FAQ>) => void;
  onCancel: () => void; onDelete: () => void;
  inputStyle: object;
}) {
  const [question, setQuestion] = useState(faq.question);
  const [answer, setAnswer] = useState(faq.answer);
  const [category, setCategory] = useState(faq.category);

  if (isEditing) {
    return (
      <div style={{ backgroundColor: '#FDF8F6', border: '1px solid #8B6B5E', borderRadius: '12px', padding: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <select style={{ ...inputStyle, marginBottom: '8px' }} value={category} onChange={e => setCategory(e.target.value)}>
            {['Product','Sizing','Shipping','Returns','Payment','Store','General'].map(c => <option key={c}>{c}</option>)}
          </select>
          <input style={{ ...inputStyle, marginBottom: '8px' }} value={question} onChange={e => setQuestion(e.target.value)} />
          <textarea style={inputStyle} rows={4} value={answer} onChange={e => setAnswer(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => onSave({ question, answer, category })} style={{ padding: '8px 16px', backgroundColor: '#6C4E44', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>Save</button>
          <button onClick={onCancel} style={{ padding: '8px 12px', border: '1px solid #D4B8B0', backgroundColor: '#fff', color: '#6C4E44', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fff', border: '1px solid #E8DDD8', borderRadius: '12px', padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', padding: '2px 10px', borderRadius: '20px', backgroundColor: '#F0EAE8', color: '#6C4E44', fontWeight: 600 }}>{faq.category}</span>
        </div>
        <div style={{ fontWeight: 600, color: '#2D2D2D', fontSize: '14px', marginBottom: '6px' }}>{faq.question}</div>
        <div style={{ color: '#555', fontSize: '13px', lineHeight: '1.5' }}>{faq.answer}</div>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button onClick={onEdit} style={{ padding: '6px 12px', border: '1px solid #D4B8B0', backgroundColor: '#fff', color: '#6C4E44', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
        <button onClick={onDelete} style={{ padding: '6px 12px', border: '1px solid #E8DDD8', backgroundColor: '#fff', color: '#C0392B', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Delete</button>
      </div>
    </div>
  );
}
