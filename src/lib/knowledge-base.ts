import type { KnowledgeBase, FAQ, StoreInfo } from '../types';

const STORAGE_KEY = 'thaya_knowledge_base';

const DEFAULT_KB: KnowledgeBase = {
  faqs: [
    {
      id: 'faq-1',
      question: 'Does the abaya come with a shaila?',
      answer: 'Yes — every THAYA abaya includes a matching shaila. It is designed as part of the piece to ensure a complete, coordinated look.',
      category: 'Product',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'faq-2',
      question: 'What fabric are your abayas made from?',
      answer: 'Our abayas are crafted from premium double-lined chiffon. Some styles are also available in neda fabric, silk organza, and linen. Each product page specifies the fabric. All fabrics are lightweight, breathable, and flow beautifully.',
      category: 'Product',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'faq-3',
      question: 'Is the chiffon double-lined?',
      answer: 'Yes. All THAYA chiffon abayas are double-lined for comfort, modesty, and a clean drape. You will not need to wear anything underneath.',
      category: 'Product',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'faq-4',
      question: 'How do I choose my size?',
      answer: 'THAYA abayas are sized by length. We recommend measuring from your shoulder to your desired length. Our sizes run from 52 (petite) to 60 (tall). If you are between sizes, we recommend sizing up. You can also DM us your height and we will suggest the right size.',
      category: 'Sizing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'faq-5',
      question: 'What sizes do you carry?',
      answer: 'We carry sizes 52, 54, 56, 58, and 60. These refer to the length of the abaya in inches. Size 54 suits most average heights. Size 56–58 suits taller women. Please check our size guide on the product page for full measurements.',
      category: 'Sizing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'faq-6',
      question: 'Do you ship to Saudi Arabia?',
      answer: 'Yes, we ship to Saudi Arabia and across the GCC. Delivery to Saudi Arabia typically takes 3–5 business days via courier. Shipping fees are calculated at checkout.',
      category: 'Shipping',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'faq-7',
      question: 'How long does UAE delivery take?',
      answer: 'UAE orders are delivered within 1–3 business days. Same-day and next-day delivery may be available in select areas. You will receive a tracking number once your order is dispatched.',
      category: 'Shipping',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'faq-8',
      question: 'Do you ship internationally?',
      answer: 'Yes, THAYA ships internationally to select countries. International delivery typically takes 5–10 business days depending on your location. Shipping fees and available destinations are shown at checkout.',
      category: 'Shipping',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'faq-9',
      question: 'Can I return my order?',
      answer: 'We accept returns within 7 days of delivery, provided the item is unworn, unwashed, and in its original condition with all tags attached. Sale items and custom orders are final sale and cannot be returned.',
      category: 'Returns',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'faq-10',
      question: 'Can I exchange for a different size?',
      answer: 'Yes, we offer exchanges for a different size within 7 days of delivery. The item must be unworn and in original condition. Please contact us to arrange your exchange.',
      category: 'Returns',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'faq-11',
      question: 'Can I return sale items?',
      answer: 'Sale items are final sale and cannot be returned or exchanged. Please check your size carefully before purchasing a sale item.',
      category: 'Returns',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'faq-12',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit and debit cards, Apple Pay, and Tabby (buy now, pay later in 4 installments). Cash on delivery may be available for UAE orders.',
      category: 'Payment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'faq-13',
      question: 'Is Tabby available?',
      answer: 'Yes, Tabby is available at checkout. You can split your purchase into 4 interest-free payments. Simply select Tabby at checkout and follow the steps.',
      category: 'Payment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'faq-14',
      question: 'Are your prints exclusive?',
      answer: 'Yes. All THAYA prints are original and designed exclusively in-house. They are not available anywhere else. Each print is developed and refined before being printed on premium fabric.',
      category: 'Product',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'faq-15',
      question: 'How do I care for my abaya?',
      answer: 'We recommend gentle hand washing or a delicate machine cycle in cold water. Do not tumble dry — hang to air dry. Iron on a low setting or steam gently. Store away from direct sunlight to preserve the fabric and print.',
      category: 'Product',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],

  policies: {
    shipping: `THAYA SHIPPING POLICY

UAE Delivery: 1–3 business days. Same-day/next-day available in select areas.
GCC (Saudi Arabia, Kuwait, Bahrain, Qatar, Oman): 3–5 business days.
International: 5–10 business days.
All orders receive a tracking number once dispatched.
Shipping fees are calculated at checkout based on destination and order weight.
Free shipping may be available on orders above a certain amount — check the website for current offers.
THAYA is not responsible for customs duties on international orders.`,

    returns: `THAYA RETURN & EXCHANGE POLICY

Return window: 7 days from delivery date.
Items must be unworn, unwashed, and in original condition with all tags attached.
Sale items are final sale — no returns or exchanges.
Custom orders are final sale.
To initiate a return or exchange, contact us at hello@thaya.ae or via WhatsApp with your order number.
Exchange: We offer exchanges for different sizes within 7 days. Subject to availability.
Refunds are processed within 5–7 business days after the returned item is received and inspected.
Original shipping fees are non-refundable.`,

    privacy: `THAYA PRIVACY POLICY

We collect customer information (name, email, address, phone) for order processing and service.
We do not sell your data to third parties.
Your information is used for order fulfilment, customer service, and marketing (if opted in).
You can unsubscribe from marketing emails at any time.
For questions about your data, contact hello@thaya.ae.`,

    faq_general: `THAYA GENERAL FAQs

Q: Do you have a physical store?
A: Yes, THAYA is available at select retail locations in the UAE. Contact us for the latest store information.

Q: Can I place a custom order?
A: Custom orders may be available for special occasions. Please contact the THAYA team directly to discuss your requirements.

Q: How do I track my order?
A: Once your order is dispatched, you will receive a tracking number via email or SMS. You can track your order using the provided link.`
  },

  storeInfo: {
    locations: [
      {
        id: 'loc-1',
        name: 'THAYA — Main Store',
        address: 'To be updated',
        city: 'Dubai',
        country: 'UAE',
        phone: '+971 XX XXX XXXX',
        hours: 'Saturday–Thursday: 10am–10pm | Friday: 2pm–10pm'
      }
    ],
    email: 'hello@thaya.ae',
    phone: '+971 XX XXX XXXX',
    whatsapp: '+971 XX XXX XXXX',
    instagram: '@thaya.ae',
    website: 'https://thaya.ae'
  },

  customResponses: {
    greeting: 'Welcome to THAYA. I\'m Layla, here to help you with anything you need — from finding the right piece to answering questions about your order. How can I help you today?',
    goodbye: 'Thank you for reaching out to THAYA. It was lovely helping you. If you need anything else, we\'re always here.',
    outOfScope: 'That\'s a great question, and I want to make sure you get the right answer. Let me connect you with our THAYA team.'
  },

  updatedAt: new Date().toISOString()
};

export function getKnowledgeBase(): KnowledgeBase {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return DEFAULT_KB;
}

export function saveKnowledgeBase(kb: KnowledgeBase): void {
  kb.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(kb));
}

export function resetKnowledgeBase(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_KB));
}

export function addFAQ(kb: KnowledgeBase, faq: Omit<FAQ, 'id' | 'createdAt' | 'updatedAt'>): KnowledgeBase {
  const newFAQ: FAQ = {
    ...faq,
    id: `faq-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  return { ...kb, faqs: [...kb.faqs, newFAQ] };
}

export function updateFAQ(kb: KnowledgeBase, id: string, updates: Partial<FAQ>): KnowledgeBase {
  return {
    ...kb,
    faqs: kb.faqs.map(f =>
      f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f
    )
  };
}

export function deleteFAQ(kb: KnowledgeBase, id: string): KnowledgeBase {
  return { ...kb, faqs: kb.faqs.filter(f => f.id !== id) };
}

export function updatePolicy(kb: KnowledgeBase, key: string, content: string): KnowledgeBase {
  return {
    ...kb,
    policies: { ...kb.policies, [key]: content }
  };
}

export function updateStoreInfo(kb: KnowledgeBase, info: Partial<StoreInfo>): KnowledgeBase {
  return { ...kb, storeInfo: { ...kb.storeInfo, ...info } };
}

export { DEFAULT_KB };
