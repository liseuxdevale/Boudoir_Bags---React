// FILE: resources/js/Pages/CartPage.jsx
import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const C = {
    sand: "#c8a96e", sandLight: "#e8d5b0", cream: "#f5f0e8",
    dark: "#1a1a1a", white: "#ffffff", coral: "#e8635a",
    muted: "#6b6056", pageBg: "#c4a882", green: "#4caf50",
};
const F = { display: "'Playfair Display', serif", sans: "'Montserrat', sans-serif" };

const FREE_SHIPPING_THRESHOLD = 2500;
const SHIPPING_FEE = 250;

const fmt = (n) =>
    `₱${Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

const imgSrc = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
};

// ── Cart Item Card ────────────────────────────────────────────
function CartItem({ item, busy, onIncrement, onDecrement, onRemove }) {
    const resolvedImg = imgSrc(item.image);
    const price     = Number(item.price) || 0;
    const lineTotal = price * item.quantity;

    return (
        <div style={{
            background: C.white, borderRadius: 16, padding: "18px 20px",
            display: "flex", alignItems: "center", gap: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            opacity: busy ? 0.6 : 1, transition: "opacity 0.2s",
        }}>
            {resolvedImg ? (
                <img src={resolvedImg} alt={item.name} style={{
                    width: 80, height: 80, objectFit: "cover",
                    borderRadius: 10, flexShrink: 0,
                }} />
            ) : (
                <div style={{
                    width: 80, height: 80, borderRadius: 10, flexShrink: 0,
                    background: "#f0ebe0", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 28, color: "#ccc",
                }}>
                    👜
                </div>
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                    margin: "0 0 2px", fontSize: 15, fontWeight: 600,
                    color: C.dark, fontFamily: F.display,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                    {item.name}
                </p>
                <p style={{ margin: "0 0 10px", fontSize: 11, color: C.muted }}>
                    {item.category}
                </p>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <button onClick={onDecrement} disabled={busy} style={stepperBtn}>−</button>
                    <span style={{
                        width: 36, textAlign: "center",
                        fontSize: 13, fontWeight: 600, color: C.dark,
                    }}>
                        {item.quantity}
                    </span>
                    <button onClick={onIncrement} disabled={busy} style={stepperBtn}>+</button>
                </div>
            </div>

            <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 700, color: C.dark }}>
                    {fmt(lineTotal)}
                </p>
                <p style={{ margin: "0 0 8px", fontSize: 11, color: C.muted }}>
                    {fmt(price)} each
                </p>
                <button
                    onClick={onRemove}
                    disabled={busy}
                    style={{
                        background: "none", border: "none",
                        color: C.coral, fontSize: 16, cursor: "pointer", padding: 0,
                    }}>
                    🗑
                </button>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────
export default function CartPage({ cart = {} }) {
    const { auth } = usePage().props;

    const cartItems  = cart.items    ?? [];
    const subtotal   = Number(cart.subtotal) || 0;
    const isFree     = subtotal >= FREE_SHIPPING_THRESHOLD;
    const shipping   = isFree ? 0 : SHIPPING_FEE;
    const total      = subtotal + shipping;
    const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);

    const [busy, setBusy] = useState(null);

    const update = (itemId, quantity) => {
        setBusy(itemId);
        router.patch(`/cart/${itemId}`, { quantity }, {
            preserveScroll: true,
            onFinish: () => setBusy(null),
        });
    };

    const remove = (itemId) => {
        setBusy(itemId);
        router.delete(`/cart/${itemId}`, {
            preserveScroll: true,
            onFinish: () => setBusy(null),
        });
    };

    // Use window.location.href so Laravel's auth middleware can
    // store /checkout as the intended URL, then redirect()->intended()
    // will send the user back to /checkout after login or register.
    const handleCheckout = () => {
        window.location.href = "/checkout";
    };

    return (
        <>
            <Head title="Cart" />
            <div style={{
                background: C.pageBg,
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                fontFamily: F.sans,
            }}>
                <Navbar />

                <div style={{ flex: 1, maxWidth: 1100, width: "100%", margin: "0 auto", padding: "60px 4% 80px", boxSizing: "border-box" }}>
                    <h1 style={{
                        fontFamily: F.display, fontWeight: 900,
                        fontSize: "clamp(2rem,4vw,3rem)",
                        color: C.white, textTransform: "uppercase", letterSpacing: 3,
                        marginBottom: 36, textShadow: "1px 2px 8px rgba(0,0,0,0.18)",
                    }}>
                        Shopping Cart
                    </h1>

                    {/* ── Empty State ── */}
                    {cartItems.length === 0 ? (
                        <div style={{
                            display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center",
                            padding: "100px 0", textAlign: "center",
                        }}>
                            <svg width="80" height="80" viewBox="0 0 80 80" fill="none"
                                style={{ marginBottom: 24, opacity: 0.85 }}>
                                <rect x="12" y="24" width="56" height="48" rx="8"
                                    stroke="white" strokeWidth="3" fill="none" />
                                <path d="M28 24V20C28 13.373 33.373 8 40 8C46.627 8 52 13.373 52 20V24"
                                    stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
                                <path d="M30 40C30 44.418 34.477 48 40 48C45.523 48 50 44.418 50 40"
                                    stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                            </svg>
                            <h2 style={{
                                fontFamily: F.display,
                                fontSize: "clamp(1.6rem,3vw,2.2rem)",
                                color: C.white, margin: "0 0 12px", fontWeight: 700,
                            }}>
                                Your Cart is Empty
                            </h2>
                            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, margin: "0 0 36px" }}>
                                Add something to your cart to get started
                            </p>
                            <button
                                onClick={() => router.visit("/shop")}
                                style={{ ...darkBtn, padding: "16px 48px", fontSize: 14, borderRadius: 10 }}>
                                Browse Products
                            </button>
                        </div>
                    ) : (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 340px",
                            gap: 28, alignItems: "start",
                        }}>
                            {/* Left — items */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                {cartItems.map(item => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        busy={busy === item.id}
                                        onIncrement={() => update(item.id, item.quantity + 1)}
                                        onDecrement={() =>
                                            item.quantity > 1
                                                ? update(item.id, item.quantity - 1)
                                                : remove(item.id)
                                        }
                                        onRemove={() => remove(item.id)}
                                    />
                                ))}
                            </div>

                            {/* Right — summary */}
                            <div style={{
                                background: C.white, borderRadius: 16,
                                padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                                position: "sticky", top: 80,
                            }}>
                                <h3 style={{
                                    fontFamily: F.display, fontSize: 20,
                                    fontWeight: 700, margin: "0 0 20px", color: C.dark,
                                }}>
                                    Order Summary
                                </h3>

                                {!isFree && (
                                    <div style={{ marginBottom: 16 }}>
                                        <p style={{ fontSize: 11, color: C.muted, margin: "0 0 6px" }}>
                                            Add {fmt(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping!
                                        </p>
                                        <div style={{
                                            height: 6, background: "#f0ebe0",
                                            borderRadius: 3, overflow: "hidden",
                                        }}>
                                            <div style={{
                                                height: "100%", borderRadius: 3, background: C.sand,
                                                width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                                                transition: "width 0.3s",
                                            }} />
                                        </div>
                                    </div>
                                )}

                                <div style={summaryRow}>
                                    <span style={{ color: C.muted, fontSize: 13 }}>
                                        Subtotal ({totalItems} item/s)
                                    </span>
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                                        {fmt(subtotal)}
                                    </span>
                                </div>

                                <div style={{ ...summaryRow, marginBottom: 16 }}>
                                    <span style={{ color: C.muted, fontSize: 13 }}>Shipping Fee</span>
                                    <span style={{
                                        fontSize: 13, fontWeight: 600,
                                        color: isFree ? C.green : C.dark,
                                    }}>
                                        {isFree ? "Free 🎉" : fmt(SHIPPING_FEE)}
                                    </span>
                                </div>

                                <div style={{
                                    borderTop: `1px solid ${C.sandLight}`,
                                    paddingTop: 16, marginBottom: 24,
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
                                        <span style={{ fontWeight: 700, fontSize: 16 }}>{fmt(total)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    style={{ ...darkBtn, width: "100%", marginBottom: 10 }}>
                                    Proceed to Checkout
                                </button>
                                <button
                                    onClick={() => router.visit("/shop")}
                                    style={{ ...outlineBtn, width: "100%" }}>
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <Footer />
            </div>
        </>
    );
}

// ── Shared styles ─────────────────────────────────────────────
const darkBtn = {
    background: C.dark, color: C.white, border: "none",
    padding: "13px 24px", borderRadius: 8, fontSize: 13,
    fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontFamily: F.sans,
};
const outlineBtn = {
    background: "transparent", color: C.dark,
    border: `1px solid ${C.sandLight}`, padding: "12px 24px",
    borderRadius: 8, fontSize: 13, fontWeight: 500,
    cursor: "pointer", fontFamily: F.sans,
};
const stepperBtn = {
    width: 28, height: 28, background: "#f0ebe0",
    border: "1px solid #ddd", borderRadius: 4,
    fontSize: 16, cursor: "pointer", fontWeight: 600,
};
const summaryRow = {
    display: "flex", justifyContent: "space-between", marginBottom: 12,
};

