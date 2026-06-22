import { useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import type { Message, KnowledgeBase, EscalationTicket, Analytics } from '../types';
import { getKnowledgeBase, saveKnowledgeBase } from '../lib/knowledge-base';
import { escalateToTeam } from '../lib/shopify';

const SESSIONS_KEY = 'thaya_sessions';
const TICKETS_KEY = 'thaya_tickets';
const ANALYTICS_KEY = 'thaya_analytics';

// ── Session management ────────────────────────────────────────────────────────

export function useChatSession() {
  const [sessionId] = useState(() => uuid());
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuid(),
      role: 'assistant',
      content: getKnowledgeBase().customResponses.greeting ||
        "Welcome to THAYA. I'm Layla, here to help you find the right piece or answer any questions. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const [kb] = useState<KnowledgeBase>(getKnowledgeBase());

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: uuid(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build conversation history for Claude (exclude greeting)
      const history = messages.slice(1).map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          conversationHistory: history,
          knowledgeBase: kb
        })
      });

      const data = await res.json();

      const assistantMessage: Message = {
        id: uuid(),
        role: 'assistant',
        content: data.reply || data.error || 'I\'m sorry, something went wrong. Please try again.',
        timestamp: new Date(),
        intents: data.intents,
        isEscalation: data.isEscalation
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (data.isEscalation) setIsEscalated(true);

      // Track analytics
      trackAnalytics(data.intents || []);

    } catch {
      setMessages(prev => [...prev, {
        id: uuid(),
        role: 'assistant',
        content: 'I\'m sorry, I\'m having trouble connecting right now. Please try again or reach us at hello@thaya.ae.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, kb]);

  const saveSession = useCallback(() => {
    try {
      const sessions = JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
      sessions.push({ id: sessionId, messages, startedAt: messages[0]?.timestamp, isEscalated });
      // Keep last 50 sessions
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions.slice(-50)));
    } catch {}
  }, [sessionId, messages, isEscalated]);

  return { messages, sendMessage, isLoading, isEscalated, saveSession };
}

// ── Knowledge base management ─────────────────────────────────────────────────

export function useKnowledgeBase() {
  const [kb, setKB] = useState<KnowledgeBase>(getKnowledgeBase());

  const update = useCallback((updatedKB: KnowledgeBase) => {
    saveKnowledgeBase(updatedKB);
    setKB(updatedKB);
  }, []);

  return { kb, update };
}

// ── Escalation management ─────────────────────────────────────────────────────

export function useEscalation() {
  const [tickets, setTickets] = useState<EscalationTicket[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(TICKETS_KEY) || '[]');
    } catch { return []; }
  });

  const submitTicket = useCallback(async (ticket: {
    name: string;
    email: string;
    phone: string;
    orderNumber: string;
    question: string;
    conversationHistory: Message[];
  }) => {
    const result = await escalateToTeam({
      ...ticket,
      conversationHistory: ticket.conversationHistory
    });

    if (result.success) {
      const newTicket: EscalationTicket = {
        id: result.ticketId,
        timestamp: new Date().toISOString(),
        customer: {
          name: ticket.name,
          email: ticket.email,
          phone: ticket.phone,
          orderNumber: ticket.orderNumber
        },
        question: ticket.question,
        status: 'open',
        conversationHistory: ticket.conversationHistory
      };

      const updated = [...tickets, newTicket];
      setTickets(updated);
      localStorage.setItem(TICKETS_KEY, JSON.stringify(updated));
    }

    return result;
  }, [tickets]);

  const updateTicketStatus = useCallback((id: string, status: EscalationTicket['status']) => {
    const updated = tickets.map(t => t.id === id ? { ...t, status } : t);
    setTickets(updated);
    localStorage.setItem(TICKETS_KEY, JSON.stringify(updated));
  }, [tickets]);

  return { tickets, submitTicket, updateTicketStatus };
}

// ── Analytics ─────────────────────────────────────────────────────────────────

function trackAnalytics(intents: string[]) {
  try {
    const analytics: Analytics = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '{"totalConversations":0,"totalMessages":0,"escalations":0,"topIntents":{},"averageMessagesPerSession":0}');
    analytics.totalMessages++;
    for (const intent of intents) {
      analytics.topIntents[intent] = (analytics.topIntents[intent] || 0) + 1;
    }
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
  } catch {}
}

export function useAnalytics(): Analytics {
  try {
    return JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '{}');
  } catch {
    return { totalConversations: 0, totalMessages: 0, escalations: 0, topIntents: {}, averageMessagesPerSession: 0 };
  }
}
