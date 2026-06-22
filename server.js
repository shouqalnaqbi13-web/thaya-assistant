// THAYA Customer Service Assistant — Backend
// Proxies Claude API calls and live Shopify storefront search
// Keep ANTHROPIC_API_KEY on the server, never expose to client

import Anthropic from '@anthropic-ai/sdk';
import express from 'express';
import cors from 'cors';

const app = express();

const SHOP_DOMAIN = process.env.SHOP_DOMAIN || 'https://shopthaya.com';
const ALLOWED_ORIGINS = [
  'https://shopthaya.com',
  /\.myshopify\.com$/
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const allowed = ALLOWED_ORIGINS.some(o => o instanceof RegExp ? o.test(origin) : o === origin);
    callback(null, allowed);
  }
}));
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Verified THAYA facts (sourced from Shopify Admin shopPolicies, not guessed) ──
const KNOWLEDGE = `
SIZING: Sizes run from 52 to 60. Every product also offers a "Customizable" option for a tailored fit, selectable on the product page. A "Size chart" link sits next to the Size selector on each product page with full measurements.

SHIPPING: Orders need about 7-10 business days for preparation and quality checks before dispatch. UAE deliveries typically arrive within 7-10 business days after dispatch. International shipping times are shown at checkout, in addition to the 7-10 day preparation period.

RETURNS & EXCHANGES: Return or exchange requests must be submitted within 24 HOURS of delivery (not days). Refunds are only available for items that are defective, damaged, or incorrectly delivered. Size exchanges may be accommodated subject to availability. Items must be unused, unwashed, in original condition with all tags attached. Sale items and custom-made abayas are final sale — no returns or exchanges. If a customer receives a faulty or incorrect item, THAYA arranges the return collection and covers delivery costs. Customers should contact the team within 24 hours with photos or videos of the issue.

PAYMENT: All major credit/debit cards, Apple Pay, and Tabby (4 interest-free installments, available at checkout for orders over AED 200).

PRODUCT: THAYA abayas include a matching shaila as standard. Fabrics include chiffon, Nida, crepe, and linen — exact fabric is listed on each product page. Care: gentle hand wash or delicate cold machine cycle, hang dry away from sunlight, steam chiffon rather than ironing.

CONTACT: Email management@shopthaya.com, call or WhatsApp +971504864641, Instagram @thaya.ae.
`;

const THAYA_SYSTEM_PROMPT = `You are Layla, THAYA's customer service assistant for an Emirati abaya and modest-fashion brand on Shopify.

PERSONALITY: warm, elegant, concise (2-4 sentences for simple questions). Never invent facts not given to you below or in the product search results. Never use clichéd marketing language like "must-have", "obsessed", "viral", "it girl".

VERIFIED THAYA FACTS (use these for any policy/sizing/shipping/contact question — do not contradict them):
${KNOWLEDGE}

PRODUCT SEARCH: If product search results are included below, recommend specific matching products by name with their price, and mention you can share a link. If no products are found for what the customer described, say so honestly and suggest they browse shopthaya.com or describe it differently — never claim a product exists if it wasn't in the search results.

ESCALATION: If the customer wants a refund/cancellation outside policy, reports a damaged item, has a complaint, wants a custom order, or asks something you cannot answer from the facts above, say: "I'd love to make sure this is handled perfectly for you. Let me connect you with our THAYA team who can assist further. Could you share your name, email, and order number?" and nothing else for that turn.`;

// ── Live Shopify storefront product search (public, no auth required) ──────────
async function searchStorefrontProducts(query) {
  try {
    const url = `${SHOP_DOMAIN}/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=5`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Storefront search failed:', res.status, await res.text());
      return [];
    }
    const data = await res.json();
    return data?.resources?.results?.products || [];
  } catch {
    return [];
  }
}

function isProductQuery(message) {
  const m = message.toLowerCase();
  return /abaya|dress|collection|black|white|beige|pink|blue|colou?r|buy|shop|show me|do you have|available|price of|how much/.test(m);
}

const FILLER_PHRASES = /^(do you have|i want to buy|show me|find|get me|looking for|want|buy|shop for|shop|i need|is there|are there)\b/gi;
const CATALOG_WORDS = new Set(['abaya', 'abayas', 'dress', 'dresses', 'piece', 'pieces', 'collection', 'any']);

function refineSearchTerm(message) {
  const stripped = message.replace(FILLER_PHRASES, '').trim();
  const words = (stripped || message).split(/\s+/).filter(w => w && !CATALOG_WORDS.has(w.toLowerCase()));
  const refined = words.join(' ').trim();
  return refined || stripped || message;
}

// ── Main chat endpoint ────────────────────────────────────────────────────────
// Contract matches snippets/thaya-chat-widget.liquid exactly:
// request:  { message: string, history: [{ type: 'user'|'bot', text: string }] }
// response: { message: string, escalate: boolean }
app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    let contextBlock = '';
    if (isProductQuery(message)) {
      const refinedTerm = refineSearchTerm(message);
      let products = await searchStorefrontProducts(refinedTerm);
      if (!products.length && refinedTerm.toLowerCase() !== message.toLowerCase()) {
        products = await searchStorefrontProducts(message);
      }
      contextBlock = products.length
        ? `\n\nPRODUCT SEARCH RESULTS for "${message}":\n${products.map(p => `- ${p.title} — AED ${(parseFloat(p.price) || 0).toFixed(0)} — ${SHOP_DOMAIN}${p.url}`).join('\n')}`
        : `\n\nPRODUCT SEARCH RESULTS for "${message}": none found.`;
    }

    const claudeMessages = [
      ...history.slice(-8).map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.text
      })),
      { role: 'user', content: message }
    ];

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      system: THAYA_SYSTEM_PROMPT + contextBlock,
      messages: claudeMessages
    });

    const reply = response.content[0].text;
    const escalate = reply.toLowerCase().includes('connect you with') || reply.toLowerCase().includes('thaya team who can assist');

    res.json({ message: reply, escalate });

  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({
      error: 'Something went wrong. Please try again.',
      message: "I'm sorry, something went wrong on my end. Please try again or contact us directly at management@shopthaya.com."
    });
  }
});

// ── Escalation endpoint ───────────────────────────────────────────────────────
// Contract matches widget: request { name, email, history }
app.post('/api/escalate', (req, res) => {
  const { name, email, history } = req.body;

  const ticket = {
    id: `ESC-${Date.now()}`,
    timestamp: new Date().toISOString(),
    customer: { name, email },
    history: history?.slice(-10) || [],
    status: 'open'
  };

  console.log('Escalation ticket created:', ticket);
  // TODO: send email/Slack notification to THAYA team, persist ticket

  res.json({ success: true, ticketId: ticket.id });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', model: 'claude-sonnet-4-6' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`THAYA Assistant server running on port ${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  ANTHROPIC_API_KEY not set — add it as an environment variable');
  }
});
