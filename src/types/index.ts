export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intents?: string[];
  isEscalation?: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Policy {
  key: string;
  label: string;
  content: string;
  updatedAt: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone?: string;
  email?: string;
  hours?: string;
  mapLink?: string;
}

export interface StoreInfo {
  locations: StoreLocation[];
  email: string;
  phone: string;
  whatsapp?: string;
  instagram?: string;
  website: string;
}

export interface KnowledgeBase {
  faqs: FAQ[];
  policies: Record<string, string>;
  storeInfo: StoreInfo;
  customResponses: Record<string, string>;
  updatedAt: string;
}

export interface EscalationTicket {
  id: string;
  timestamp: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    orderNumber: string;
  };
  question: string;
  status: 'open' | 'in_progress' | 'resolved';
  conversationHistory: Message[];
}

export interface ChatSession {
  id: string;
  messages: Message[];
  startedAt: string;
  isEscalated: boolean;
}

export interface Analytics {
  totalConversations: number;
  totalMessages: number;
  escalations: number;
  topIntents: Record<string, number>;
  averageMessagesPerSession: number;
}
