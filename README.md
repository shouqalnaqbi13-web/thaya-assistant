# THAYA Customer Service Assistant

AI-powered customer service chatbot for THAYA (@thaya.ae), built with React, TypeScript, and Claude AI.

---

## Quick Start

### 1. Install Node.js
Download from https://nodejs.org — choose the LTS version.

### 2. Open this folder in your terminal
```
cd "thaya-assistant"
```

### 3. Install dependencies
```
npm install
```

### 4. Set up your API key
```
cp .env.example .env
```
Open `.env` and add your Anthropic API key.
Get one at: https://console.anthropic.com

### 5. Run the app
```
npm run dev
```

This starts both:
- **Chatbot** → http://localhost:5173
- **Admin** → http://localhost:5173/admin
- **Server** → http://localhost:3001

---

## What's Included

| Feature | Location |
|---|---|
| Customer chat widget | `/` |
| Admin dashboard | `/admin` |
| FAQ editor | `/admin` → FAQs tab |
| Policy editor | `/admin` → Policies tab |
| Escalation inbox | `/admin` → Escalations tab |
| Analytics | `/admin` → Analytics tab |

---

## How the AI Works

Every customer message goes through this flow:

1. **Intent detection** — identifies what the customer is asking about (fabric, sizing, returns, etc.)
2. **Knowledge base search** — searches your FAQs and policies for relevant content
3. **Shopify search** (when connected) — pulls real product and order data
4. **Claude AI** — generates a natural, on-brand response using the retrieved context
5. **Escalation check** — if the bot isn't confident, it offers to connect the customer with the team

---

## Training Layla (Your AI Assistant)

Layla learns from your knowledge base. The more you add, the better she answers.

### Add FAQs
Go to `/admin` → FAQs → click "Add FAQ". Add real customer questions and your exact answers.

### Update Policies
Go to `/admin` → Policies → paste your full shipping, returns, and other policies.

### Update Store Info
Go to `/admin` → Settings → update your store address, phone, email, WhatsApp.

---

## Connecting to Shopify

When you're ready to connect real product and order data:

### Step 1 — Create a Shopify Private App
1. Go to your Shopify admin → Apps → Develop apps
2. Create a new app called "THAYA Assistant"
3. Enable these API scopes:
   - `read_products`
   - `read_inventory`
   - `read_orders`
   - `read_customers`
   - `read_content` (for policy pages)
4. Install the app and copy the Admin API access token

### Step 2 — Add credentials to .env
```
VITE_SHOPIFY_DOMAIN=thaya.myshopify.com
VITE_SHOPIFY_ACCESS_TOKEN=shpat_xxxxx
```

### Step 3 — Activate the stub functions
Open `src/lib/shopify.ts` and uncomment the real API calls inside each function.
Each function has a clear `// TODO:` comment showing exactly what to replace.

The stub functions are:
- `searchProductInfo(query)` — search products by name
- `searchProductAvailability(title)` — check stock per size
- `searchOrderStatus(orderNumber)` — look up order status
- `searchPolicyPages()` — pull shipping/returns pages from Shopify
- `escalateToTeam(ticket)` — send escalation to your team

---

## Deploying to Shopify (Shopify Theme Integration)

To embed the chat widget directly into your Shopify theme:

### Step 1 — Build the app
```
npm run build
```

### Step 2 — Host the server
Deploy `server.js` to a hosting service:
- **Railway** (recommended) — free tier, simple setup
- **Render** — free tier available
- **Heroku** — simple Node.js deployment

Set the `ANTHROPIC_API_KEY` environment variable on your hosting platform.

### Step 3 — Embed in Shopify theme
Add this snippet to your Shopify theme's `theme.liquid` before `</body>`:

```html
<!-- THAYA Customer Service Assistant -->
<div id="thaya-chat-root"></div>
<script>
  window.THAYA_API_URL = 'https://your-server-url.railway.app';
</script>
<script src="https://your-cdn.com/thaya-assistant.js"></script>
```

### Step 4 — Update the API URL
In `vite.config.ts`, update the proxy target to your hosted server URL before building.

---

## File Structure

```
thaya-assistant/
├── server.js              ← AI backend (Claude + Shopify stubs)
├── src/
│   ├── App.tsx            ← Routes (/ customer, /admin)
│   ├── types/index.ts     ← TypeScript types
│   ├── lib/
│   │   ├── knowledge-base.ts  ← FAQ + policy storage
│   │   └── shopify.ts         ← Shopify API stubs
│   ├── store/index.ts     ← State management
│   └── components/
│       ├── Chat/          ← Customer-facing chat UI
│       └── Admin/         ← Admin dashboard
├── .env.example           ← Environment variables template
└── README.md
```

---

## Brand Colours

| Name | Hex |
|---|---|
| Deep rose | `#6C4E44` |
| Medium rose | `#8B6B5E` |
| Light rose | `#A0856D` |
| Blush background | `#FAF6F4` |
| Card background | `#F0EAE8` |

---

## Support

For questions about setup, contact: hello@thaya.ae
