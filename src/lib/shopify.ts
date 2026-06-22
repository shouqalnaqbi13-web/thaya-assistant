// THAYA Shopify Integration Layer
// Replace placeholder functions with real Shopify Admin API calls
// Docs: https://shopify.dev/docs/api/admin-rest

const SHOPIFY_CONFIG = {
  shopDomain: import.meta.env.VITE_SHOPIFY_DOMAIN || 'thaya.myshopify.com',
  accessToken: import.meta.env.VITE_SHOPIFY_ACCESS_TOKEN || '',
  apiVersion: '2024-01'
};

export interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  tags: string;
  variants: ShopifyVariant[];
  images: { src: string }[];
  status: string;
}

export interface ShopifyVariant {
  id: number;
  title: string;
  price: string;
  inventory_quantity: number;
  option1: string; // size
}

export interface ShopifyOrder {
  id: number;
  name: string;
  email: string;
  financial_status: string;
  fulfillment_status: string | null;
  tracking_number?: string;
  line_items: { title: string; quantity: number }[];
  created_at: string;
}

// ── Product Search ────────────────────────────────────────────────────────────

export async function searchProductInfo(query: string): Promise<ShopifyProduct[]> {
  // TODO: Replace with real Shopify API call
  // const res = await fetch(
  //   `https://${SHOPIFY_CONFIG.shopDomain}/admin/api/${SHOPIFY_CONFIG.apiVersion}/products.json?title=${encodeURIComponent(query)}`,
  //   { headers: { 'X-Shopify-Access-Token': SHOPIFY_CONFIG.accessToken } }
  // );
  // const data = await res.json();
  // return data.products;

  console.log(`[Shopify Stub] searchProductInfo("${query}") — connect API to activate`);
  return [];
}

export async function searchProductAvailability(productTitle: string): Promise<{
  available: boolean;
  variants: { size: string; available: boolean; quantity: number }[];
} | null> {
  // TODO: Connect Shopify Inventory API
  // 1. Find product by title
  // 2. Get inventory levels for all variants
  // 3. Return availability per size

  console.log(`[Shopify Stub] searchProductAvailability("${productTitle}") — connect API to activate`);
  return null;
}

export async function getProductDetails(productId: number): Promise<ShopifyProduct | null> {
  // TODO: GET /admin/api/2024-01/products/${productId}.json
  console.log(`[Shopify Stub] getProductDetails(${productId}) — connect API to activate`);
  return null;
}

export async function getCollectionProducts(collectionHandle: string): Promise<ShopifyProduct[]> {
  // TODO: GET /admin/api/2024-01/collections.json?handle=${handle}
  console.log(`[Shopify Stub] getCollectionProducts("${collectionHandle}") — connect API to activate`);
  return [];
}

// ── Order Management ──────────────────────────────────────────────────────────

export async function searchOrderStatus(orderNumber: string, email?: string): Promise<ShopifyOrder | null> {
  // TODO: GET /admin/api/2024-01/orders.json?name=${orderNumber}
  console.log(`[Shopify Stub] searchOrderStatus("${orderNumber}") — connect API to activate`);
  return null;
}

export async function getOrderTracking(orderId: number): Promise<string | null> {
  // TODO: GET /admin/api/2024-01/fulfillments.json?order_id=${orderId}
  console.log(`[Shopify Stub] getOrderTracking(${orderId}) — connect API to activate`);
  return null;
}

// ── Customer Management ───────────────────────────────────────────────────────

export async function findCustomerByEmail(email: string) {
  // TODO: GET /admin/api/2024-01/customers/search.json?query=email:${email}
  console.log(`[Shopify Stub] findCustomerByEmail("${email}") — connect API to activate`);
  return null;
}

// ── Policy & Content Pages ────────────────────────────────────────────────────

export async function searchPolicyPages(): Promise<{ title: string; body_html: string }[]> {
  // TODO: GET /admin/api/2024-01/pages.json
  // Filter for shipping, returns, FAQ pages
  console.log('[Shopify Stub] searchPolicyPages() — connect API to activate');
  return [];
}

export async function searchWebsiteContent(query: string): Promise<string[]> {
  // TODO: Use Shopify Search API or Predictive Search
  // GET /search/suggest.json?q=${query}&resources[type]=product,page,article
  console.log(`[Shopify Stub] searchWebsiteContent("${query}") — connect API to activate`);
  return [];
}

// ── Support & Escalation ──────────────────────────────────────────────────────

export async function createCustomerNote(customerId: number, note: string): Promise<boolean> {
  // TODO: PUT /admin/api/2024-01/customers/${customerId}.json with note field
  console.log(`[Shopify Stub] createCustomerNote(${customerId}) — connect API to activate`);
  return false;
}

export async function createOrderNote(orderId: number, note: string): Promise<boolean> {
  // TODO: PUT /admin/api/2024-01/orders/${orderId}.json with note field
  console.log(`[Shopify Stub] createOrderNote(${orderId}) — connect API to activate`);
  return false;
}

// ── Store Information ─────────────────────────────────────────────────────────

export async function searchStoreInformation(): Promise<object | null> {
  // TODO: GET /admin/api/2024-01/shop.json
  console.log('[Shopify Stub] searchStoreInformation() — connect API to activate');
  return null;
}

export async function escalateToTeam(ticket: {
  name: string;
  email: string;
  phone?: string;
  orderNumber?: string;
  question: string;
  conversationHistory: unknown[];
}): Promise<{ success: boolean; ticketId: string }> {
  // TODO: Create a Shopify customer tag or note, or send email via Shopify Flow
  // For now: POST to your backend which sends to team email
  try {
    const res = await fetch('/api/escalate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket)
    });
    return await res.json();
  } catch {
    return { success: false, ticketId: '' };
  }
}
