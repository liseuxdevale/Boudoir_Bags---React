// FILE: resources/js/Pages/ConfirmationPage.jsx
// Props from OrderController@confirmation:
//   order → { id, order_number, subtotal, shipping, total, payment_method,
//              status, items: [...], shipping_info: {...} }

import { Head, router } from "@inertiajs/react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const C = {
    sand: "#c8a96e", sandLight: "#e8d5b0", cream: "#f5f0e8",
    dark: "#1a1a1a", white: "#ffffff", coral: "#e8635a",
    muted: "#6b6056", pageBg: "#c4a882", green: "#00FF00",
};
const F = { display: "'Playfair Display', serif", sans: "'Montserrat', sans-serif" };

const fmt = (n) =>
    `₱${Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

const paymentLabel = (method) => {
    switch (method) {
        case "cod":   return "🚚 Cash on Delivery";
        case "gcash": return "📱 GCash";
        case "card":  return "🏦 Bank Transfer";
        default:      return method ?? "N/A";
    }
};


// ── Main Page ─────────────────────────────────────────────────
export default function ConfirmationPage({ order }) {
    if (!order) {
        return (
            <>
                <Head title="Order Not Found" />
                <div style={{ background: C.pageBg, minHeight: "100vh", fontFamily: F.sans }}>
                    <Navbar />
                    <div style={{ textAlign: "center", padding: "100px 20px", color: C.white }}>
                        <p style={{ fontSize: 18, marginBottom: 24 }}>No order found.</p>
                        <button onClick={() => router.visit("/")} style={darkBtn}>
                            Back to Home
                        </button>
                    </div>
                    <Footer />
                </div>
            </>
        );
    }

    const {
        order_number,
        items = [],
        subtotal,
        shipping,
        total,
        payment_method,
        status = "Pending",
        shipping_info = {},
    } = order;

    const isFree = Number(shipping) === 0;

    return (
        <>
            <Head title="Order Confirmed" />
            <style>{`
                @keyframes draw { to { stroke-dashoffset: 0; } }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div style={{ background: C.pageBg, minHeight: "100vh", fontFamily: F.sans }}>
                <Navbar />

                <div style={{
                    maxWidth: 700, margin: "0 auto",
                    padding: "60px 4% 80px",
                    animation: "fadeUp 0.5s ease both",
                }}>

                    {/* ── Success Header ── */}
                    <div style={{ textAlign: "center", marginBottom: 40 }}>
                        <div style={{ width: 90, height: 90, margin: "0 auto 24px" }}>
                            <svg viewBox="0 0 100 100" width="90" height="90">
                                <circle cx="50" cy="50" r="46" fill="none"
                                    stroke={C.green} strokeWidth="6" />
                                <polyline
                                    points="28,52 44,68 72,34"
                                    fill="none"
                                    stroke={C.green}
                                    strokeWidth="7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{
                                        strokeDasharray: 100,
                                        strokeDashoffset: 100,
                                        animation: "draw 0.6s 0.2s ease forwards",
                                    }}
                                />
                            </svg>
                        </div>

                        <h1 style={{
                            fontFamily: F.display,
                            fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                            fontWeight: 700, color: C.white, margin: "0 0 12px",
                        }}>
                            Thank You for Your Order!
                        </h1>
                        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, margin: 0 }}>
                            Your order has been successfully placed and is being processed.
                        </p>
                    </div>

                    {/* ── Order Details Card ── */}
                    <div style={{
                        background: C.white, borderRadius: 20,
                        padding: "32px 36px",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                        marginBottom: 28,
                    }}>

                        {/* Order number + status */}
                        <div style={{
                            display: "flex", justifyContent: "space-between",
                            alignItems: "flex-start", marginBottom: 24,
                        }}>
                            <div>
                                <p style={{ margin: "0 0 6px", fontSize: 12, color: C.muted, letterSpacing: 0.5 }}>
                                    Order Number
                                </p>
                                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.dark }}>
                                    {order_number}
                                </p>
                            </div>
                            <div style={{
                                display: "flex", alignItems: "center", gap: 6,
                                border: "1px solid #ddd", borderRadius: 8, padding: "6px 14px",
                            }}>
                                <span style={{ fontSize: 16 }}>📦</span>
                                <span style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>
                                    {status}
                                </span>
                            </div>
                        </div>

                        <Divider />

                        {/* Order Summary */}
                        <Section title="Order Summary">
                            {items.map(item => {
                                const img = item.image
                                    ?? "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=60&q=80";
                                return (
                                    <div key={item.id} style={{
                                        display: "flex", alignItems: "center",
                                        gap: 14, marginBottom: 12,
                                    }}>
                                        <img src={img} alt={item.name} style={{
                                            width: 52, height: 52, objectFit: "cover",
                                            borderRadius: 8, background: "#eee",
                                        }} />
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 600, color: C.dark }}>
                                                {item.name}
                                            </p>
                                            <p style={{ margin: 0, fontSize: 11, color: C.muted }}>
                                                Qty: {item.quantity} × {fmt(item.price)}
                                            </p>
                                        </div>
                                        <span style={{ fontSize: 14, fontWeight: 700 }}>
                                            {fmt(item.price * item.quantity)}
                                        </span>
                                    </div>
                                );
                            })}
                        </Section>

                        <Divider />

                        {/* Shipping Info */}
                        <Section title="Shipping Information">
                            <p style={infoText}><strong>{shipping_info.full_name}</strong></p>
                            <p style={infoText}>{shipping_info.phone}</p>
                            <p style={infoText}>{shipping_info.address}</p>
                            <p style={infoText}>
                                {shipping_info.city}{shipping_info.zip ? `, ${shipping_info.zip}` : ""}
                            </p>
                        </Section>

                        <Divider />

                        {/* Payment Method */}
                        <Section title="Payment Method">
                            <p style={infoText}>{paymentLabel(payment_method)}</p>
                        </Section>

                        <Divider />

                        {/* Totals */}
                        <div style={{ marginTop: 16 }}>
                            <div style={summaryRow}>
                                <span style={{ fontSize: 13, color: C.muted }}>Subtotal</span>
                                <span style={{ fontSize: 13 }}>{fmt(subtotal)}</span>
                            </div>
                            <div style={{
                                ...summaryRow,
                                paddingBottom: 16,
                                borderBottom: `1px solid ${C.sandLight}`,
                            }}>
                                <span style={{ fontSize: 13, color: C.muted }}>Shipping Fee</span>
                                <span style={{
                                    fontSize: 13,
                                    color: isFree ? C.green : C.dark,
                                    fontWeight: 600,
                                }}>
                                    {isFree ? "Free" : fmt(shipping)}
                                </span>
                            </div>
                            <div style={{ ...summaryRow, marginTop: 16 }}>
                                <span style={{ fontSize: 17, fontWeight: 700 }}>Total</span>
                                <span style={{ fontSize: 17, fontWeight: 700, color: C.dark }}>
                                    {fmt(total)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── Actions ── */}
                    <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                        <button onClick={() => router.visit("/shop")} style={darkBtn}>
                            Continue Shopping
                        </button>
                        <button onClick={() => router.visit("/")} style={outlineBtn}>
                            Back to Home
                        </button>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}

// ── Helpers ───────────────────────────────────────────────────
function Divider() {
    return (
        <hr style={{ border: "none", borderTop: "1px solid #f0ebe0", margin: "20px 0" }} />
    );
}

function Section({ title, children }) {
    return (
        <div style={{ marginBottom: 4 }}>
            <h4 style={{
                fontFamily: F.display, fontSize: 16, fontWeight: 700,
                color: C.dark, margin: "0 0 12px",
            }}>
                {title}
            </h4>
            {children}
        </div>
    );
}

const infoText   = { margin: "0 0 4px", fontSize: 13, color: C.muted };
const summaryRow = { display: "flex", justifyContent: "space-between", marginBottom: 8 };
const darkBtn    = {
    background: C.dark, color: C.white, border: "none",
    padding: "14px 32px", borderRadius: 8, fontSize: 13,
    fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontFamily: F.sans,
};
const outlineBtn = {
    background: "transparent", color: C.dark, border: `2px solid ${C.dark}`,
    padding: "12px 32px", borderRadius: 8, fontSize: 13,
    fontWeight: 600, cursor: "pointer", fontFamily: F.sans,
};
