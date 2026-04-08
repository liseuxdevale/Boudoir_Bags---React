// FILE: resources/js/Pages/CheckoutPage.jsx
// Props from OrderController@checkout:
//   cart → { items, subtotal, shipping, total, total_items }
//   auth → shared via HandleInertiaRequests

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

const FREE_THRESHOLD = 2500;
const SHIPPING_FEE   = 250;

const fmt = (n) => `₱${Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;



// ── Main Page ─────────────────────────────────────────────────
export default function CheckoutPage({ cart = {} }) {
    const { errors: serverErrors = {} } = usePage().props;

    // ── Safely parse cart data (fixes ₱NaN) ──────────────────
    const cartItems = cart.items ?? [];
    const subtotal  = Number(cart.subtotal) || cartItems.reduce((s, i) => s + (Number(i.price) || 0) * i.quantity, 0);
    const isFree    = subtotal >= FREE_THRESHOLD;
    const shipping  = isFree ? 0 : SHIPPING_FEE;
    const total     = subtotal + shipping;
    const totalQty  = cartItems.reduce((s, i) => s + i.quantity, 0);

    const [form, setForm] = useState({
        full_name: "",
        phone:     "",
        address:   "",
        city:      "",
        zip:       "",
    });
    const [payment, setPayment] = useState("cod");
    const [errors,  setErrors]  = useState({});
    const [busy,    setBusy]    = useState(false);

    const set = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const validate = () => {
        const e = {};
        if (!form.full_name.trim()) e.full_name = "Full name is required";
        if (!form.phone.trim())     e.phone     = "Phone number is required";
        if (!form.address.trim())   e.address   = "Address is required";
        if (!form.city.trim())      e.city      = "City is required";
        if (!form.zip.trim())       e.zip       = "Zip code is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handlePlaceOrder = () => {
        if (!validate()) return;
        setBusy(true);
        router.post("/checkout", {
            ...form,
            payment_method: payment,
        }, {
            onError:  () => setBusy(false),
            onFinish: () => setBusy(false),
        });
    };

    const allErrors = { ...errors, ...serverErrors };

    // ── Empty cart guard ──────────────────────────────────────
    if (cartItems.length === 0) {
        return (
            <>
                <Head title="Checkout" />
                <div style={{ background: C.pageBg, minHeight: "100vh", fontFamily: F.sans }}>
                    <Navbar />
                    <div style={{ textAlign: "center", padding: "100px 20px", color: C.white }}>
                        <p style={{ fontSize: 20, marginBottom: 24 }}>Your cart is empty.</p>
                        <button onClick={() => router.visit("/shop")} style={darkBtn}>
                            Browse Products
                        </button>
                    </div>
                    <Footer />
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Checkout" />
            <div style={{ background: C.pageBg, minHeight: "100vh", fontFamily: F.sans }}>
                <Navbar />

                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 4% 80px" }}>
                    <h1 style={{
                        fontFamily: F.display, fontWeight: 900,
                        fontSize: "clamp(2rem,4vw,3rem)",
                        color: C.white, textTransform: "uppercase", letterSpacing: 3,
                        marginBottom: 40, textShadow: "1px 2px 8px rgba(0,0,0,0.18)",
                    }}>
                        Checkout
                    </h1>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 340px",
                        gap: 28, alignItems: "start",
                    }}>
                        {/* ── Left: Shipping + Payment ── */}
                        <div style={{
                            background: C.white, borderRadius: 16,
                            padding: "28px 32px",
                            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                        }}>
                            <h3 style={{
                                fontFamily: F.display, fontSize: 18,
                                fontWeight: 700, margin: "0 0 24px", color: C.dark,
                            }}>
                                Shipping Information
                            </h3>

                            <FormField label="Full Name" required error={allErrors.full_name}>
                                <input
                                    value={form.full_name}
                                    onChange={e => set("full_name", e.target.value)}
                                    style={inputStyle(!!allErrors.full_name)}
                                    placeholder="e.g. Maria Santos"
                                />
                            </FormField>

                            <FormField label="Phone Number" required error={allErrors.phone}>
                                <input
                                    value={form.phone}
                                    onChange={e => set("phone", e.target.value)}
                                    style={inputStyle(!!allErrors.phone)}
                                    placeholder="09XXXXXXXXX"
                                    type="tel"
                                />
                            </FormField>

                            <FormField label="Address" required error={allErrors.address}>
                                <input
                                    value={form.address}
                                    onChange={e => set("address", e.target.value)}
                                    style={inputStyle(!!allErrors.address)}
                                    placeholder="Street, Barangay"
                                />
                            </FormField>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <FormField label="City" required error={allErrors.city}>
                                    <input
                                        value={form.city}
                                        onChange={e => set("city", e.target.value)}
                                        style={inputStyle(!!allErrors.city)}
                                        placeholder="e.g. Cebu City"
                                    />
                                </FormField>
                                <FormField label="Zip Code" required error={allErrors.zip}>
                                    <input
                                        value={form.zip}
                                        onChange={e => set("zip", e.target.value)}
                                        style={inputStyle(!!allErrors.zip)}
                                        placeholder="e.g. 6000"
                                    />
                                </FormField>
                            </div>

                            {/* Payment Method */}
                            <h3 style={{
                                fontFamily: F.display, fontSize: 18,
                                fontWeight: 700, margin: "24px 0 18px", color: C.dark,
                            }}>
                                Payment Method
                            </h3>
                            <label style={radioRow}>
                                <input
                                    type="radio" value="cod"
                                    checked={payment === "cod"}
                                    onChange={() => setPayment("cod")}
                                    style={{ marginRight: 10 }}
                                />
                                <span style={{ fontSize: 13 }}>🚚 Cash on Delivery</span>
                            </label>
                            <label style={radioRow}>
                                <input
                                    type="radio" value="gcash"
                                    checked={payment === "gcash"}
                                    onChange={() => setPayment("gcash")}
                                    style={{ marginRight: 10 }}
                                />
                                <span style={{ fontSize: 13 }}>📱 GCash</span>
                            </label>
                            <label style={radioRow}>
                                <input
                                    type="radio" value="card"
                                    checked={payment === "card"}
                                    onChange={() => setPayment("card")}
                                    style={{ marginRight: 10 }}
                                />
                                <span style={{ fontSize: 13 }}>🏦 Bank Transfer</span>
                            </label>
                        </div>

                        {/* ── Right: Order Summary ── */}
                        <div style={{
                            background: C.white, borderRadius: 16, padding: 28,
                            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                            position: "sticky", top: 80,
                        }}>
                            <h3 style={{
                                fontFamily: F.display, fontSize: 20,
                                fontWeight: 700, margin: "0 0 20px", color: C.dark,
                            }}>
                                Order Summary
                            </h3>

                            {/* Items list */}
                            {cartItems.map(item => {
                                const price     = Number(item.price) || 0;
                                const lineTotal = price * item.quantity;
                                return (
                                    <div key={item.id} style={{
                                        display: "flex", justifyContent: "space-between",
                                        marginBottom: 10, alignItems: "flex-start", gap: 8,
                                    }}>
                                        <span style={{ fontSize: 13, color: C.dark, flex: 1 }}>
                                            {item.name} × {item.quantity}
                                        </span>
                                        <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
                                            {fmt(lineTotal)}
                                        </span>
                                    </div>
                                );
                            })}

                            <div style={{
                                borderTop: `1px solid ${C.sandLight}`,
                                marginTop: 12, paddingTop: 14,
                            }}>
                                <div style={summaryRow}>
                                    <span style={{ fontSize: 12, color: C.muted }}>
                                        Subtotal ({totalQty} item/s)
                                    </span>
                                    <span style={{ fontSize: 12 }}>{fmt(subtotal)}</span>
                                </div>
                                <div style={{ ...summaryRow, marginBottom: 16 }}>
                                    <span style={{ fontSize: 12, color: C.muted }}>Shipping Fee</span>
                                    <span style={{
                                        fontSize: 12, fontWeight: 600,
                                        color: isFree ? C.green : C.dark,
                                    }}>
                                        {isFree ? "Free 🎉" : fmt(SHIPPING_FEE)}
                                    </span>
                                </div>
                                <div style={{
                                    display: "flex", justifyContent: "space-between",
                                    marginBottom: 20,
                                }}>
                                    <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
                                    <span style={{ fontWeight: 700, fontSize: 16 }}>{fmt(total)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={busy}
                                style={{ ...darkBtn, width: "100%", opacity: busy ? 0.7 : 1 }}>
                                {busy ? "Placing Order…" : "Place Order"}
                            </button>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}

// ── Sub-components ────────────────────────────────────────────
function FormField({ label, required, error, children }) {
    return (
        <div style={{ marginBottom: 18 }}>
            <label style={{
                display: "block", fontSize: 12, color: "#333",
                marginBottom: 6, fontFamily: F.sans,
            }}>
                {label}
                {required && <span style={{ color: C.coral }}> *</span>}
            </label>
            {children}
            {error && (
                <p style={{ margin: "4px 0 0", fontSize: 11, color: C.coral }}>{error}</p>
            )}
        </div>
    );
}

// ── Shared styles ─────────────────────────────────────────────
const inputStyle = (hasError) => ({
    width: "100%", padding: "10px 12px",
    border: `1px solid ${hasError ? C.coral : "#e0dbd3"}`,
    borderRadius: 6, background: "#f5f2ee",
    fontSize: 13, color: C.dark,
    fontFamily: F.sans, outline: "none", boxSizing: "border-box",
});
const darkBtn    = {
    background: C.dark, color: C.white, border: "none",
    padding: "13px 24px", borderRadius: 8, fontSize: 13,
    fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontFamily: F.sans,
};
const summaryRow = { display: "flex", justifyContent: "space-between", marginBottom: 8 };
const radioRow   = { display: "flex", alignItems: "center", marginBottom: 14, cursor: "pointer", fontSize: 13 };
