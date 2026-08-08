/* Shared API helper for LATK Cafe frontend */
const API_BASE = "/api";

function getToken() {
  return localStorage.getItem("latk_token");
}
function getUser() {
  const raw = localStorage.getItem("latk_user");
  return raw ? JSON.parse(raw) : null;
}
function saveSession(token, user) {
  localStorage.setItem("latk_token", token);
  localStorage.setItem("latk_user", JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem("latk_token");
  localStorage.removeItem("latk_user");
}
function logout() {
  clearSession();
  window.location.href = "/login.html";
}

async function api(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = "Bearer " + token;

  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }
  return data;
}

// Redirect to login if not authenticated (call on protected customer pages)
function requireAuth() {
  if (!getToken()) {
    window.location.href = "/login.html";
  }
}

// Redirect to login if not an authenticated admin (call on admin pages)
function requireAdminAuth() {
  const user = getUser();
  if (!getToken() || !user || !user.isAdmin) {
    window.location.href = "/admin/login.html";
  }
}

function peso(n) {
  return "₱" + Number(n || 0).toFixed(2);
}

// ---- Cart helpers (stored client-side until checkout) ----
function getCart() {
  const raw = localStorage.getItem("latk_cart");
  return raw ? JSON.parse(raw) : [];
}
function saveCart(cart) {
  localStorage.setItem("latk_cart", JSON.stringify(cart));
}
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((i) => i.productId === product._id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ productId: product._id, name: product.name, price: product.price, qty: 1 });
  }
  saveCart(cart);
  return cart;
}
function updateCartQty(productId, delta) {
  let cart = getCart();
  cart = cart
    .map((i) => (i.productId === productId ? { ...i, qty: i.qty + delta } : i))
    .filter((i) => i.qty > 0);
  saveCart(cart);
  return cart;
}
function removeFromCart(productId) {
  const cart = getCart().filter((i) => i.productId !== productId);
  saveCart(cart);
  return cart;
}
function cartSubtotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}
function clearCart() {
  localStorage.removeItem("latk_cart");
}

// Renders the nav "Cart" badge count if element with id="cartCount" exists
function refreshCartBadge() {
  const el = document.getElementById("cartCount");
  if (el) {
    const count = getCart().reduce((s, i) => s + i.qty, 0);
    el.textContent = count;
    el.style.display = count > 0 ? "inline-block" : "none";
  }
}
