// FILE: resources/js/Pages/ProductDetailsPage.jsx

import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import Navbar from "../components/Navbar";

const C = {
    sand: "#c8a96e", sandLight: "#e8d5b0", cream: "#f5f0e8",
    dark: "#1a1a1a", white: "#ffffff", coral: "#e8635a",
    muted: "#6b6056", pageBg: "#c4a882", green: "#00FF00",
};
const F = { display: "'Playfair Display', serif", sans: "'Montserrat', sans-serif" };

const PERKS = [
    "Premium quality materials",
    "Free shipping on orders over ₱2,500.00",
    "30-day return policy",
    "1-year warranty",
];

const FONTS_URL = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Montserrat:wght@400;500;600&display=swap";

// ── Helpers ───────────────────────────────────────────────────
const fmt = (n) => `₱${Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

function getImage(product) {
    const first = product.images?.[0];
    if (!first) return "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80";
    return typeof first === "string" ? first : (first.url ?? first.image_url ?? first.path ?? "");
}

function getCategoryName(product) {
    if (!product.category) return "";
    return typeof product.category === "string" ? product.category : (product.category.name ?? "");
}

function getStock(product) {
    // inventory can be a relation object or a plain number column
    if (product.inventory?.quantity != null) return product.inventory.quantity;
    if (product.quantity != null) return product.quantity;
    return 30;
}


// ── Other Product Card ────────────────────────────────────────
function OtherProductCard({ product }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onClick={() => router.visit(`/product/${product.id}`)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: C.white, borderRadius: 16, overflow: "hidden",
                boxShadow: hovered ? "0 12px 32px rgba(0,0,0,0.15)" : "0 4px 16px rgba(0,0,0,0.07)",
                transform: hovered ? "translateY(-4px)" : "translateY(0)",
                transition: "all 0.3s ease", cursor: "pointer",
            }}>
            <div style={{ height: 180, background: "#e8e8e8", overflow: "hidden" }}>
                <img src={getImage(product)} alt={product.name} style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    transform: hovered ? "scale(1.06)" : "scale(1)",
                    transition: "transform 0.4s ease",
                }} />
            </div>
            <div style={{ padding: "14px 16px 18px" }}>
                <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: C.dark, fontFamily: F.display }}>
                    {product.name}
                </p>
                <p style={{ margin: "0 0 8px", fontSize: 11, color: C.muted }}>
                    {getCategoryName(product)}
                </p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.dark }}>
                    {fmt(product.price)}
                </p>
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────
// Props come from ProductController@show:
//   product → Product model (with images, inventory, category)
//   related → array of related Product models
export default function ProductDetailsPage({ product, related = [] }) {
    const { auth } = usePage().props;

    const [qty,   setQty]   = useState(1);
    const [added, setAdded] = useState(false);
    const [busy,  setBusy]  = useState(false);

    const maxQty    = getStock(product);
    const decrement = () => setQty(q => Math.max(1, q - 1));
    const increment = () => setQty(q => Math.min(maxQty, q + 1));

    const handleAddToCart = () => {
        if (busy) return;
        setBusy(true);
        router.post("/cart/add", { product_id: product.id, quantity: qty }, {
            preserveScroll: true,
            onSuccess: () => {
                setAdded(true);
                setBusy(false);
                setTimeout(() => setAdded(false), 2000);
            },
            onError: () => setBusy(false),
        });
    };

    return (
        <>
            <Head title={product.name} />
            <link rel="stylesheet" href={FONTS_URL} />

            <div style={{ background: C.pageBg, minHeight: "100vh", fontFamily: F.sans }}>
                <Navbar auth={auth} />

                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "104px 4% 80px" }}>

                    {/* Back button */}
                    <button onClick={() => router.visit("/shop")} style={{
                        background: "none", border: "none", cursor: "pointer", color: C.white,
                        display: "flex", alignItems: "center", gap: 6, fontSize: 13,
                        fontFamily: F.sans, marginBottom: 32, padding: 0,
                    }}>
                        ← Back to Home
                    </button>

                    {/* Main grid */}
                    <div style={{
                        display: "grid", gridTemplateColumns: "1fr 1fr",
                        gap: 48, alignItems: "start", marginBottom: 64,
                    }}>
                        {/* Image */}
                        <div style={{
                            background: "linear-gradient(180deg, #c8c8c8 0%, #e8e8e8 100%)",
                            borderRadius: 20, overflow: "hidden", aspectRatio: "1",
                        }}>
                            <img src={getImage(product)} alt={product.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>

                        {/* Info */}
                        <div>
                            {/* Category badge */}
                            <span style={{
                                display: "inline-block", padding: "4px 12px",
                                border: `1px solid ${C.sandLight}`, borderRadius: 20,
                                fontSize: 11, color: C.dark, background: C.white,
                                marginBottom: 16, fontWeight: 500,
                            }}>
                                {getCategoryName(product)}
                            </span>

                            <h1 style={{
                                fontFamily: F.display, fontWeight: 700,
                                fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                                color: C.white, margin: "0 0 12px",
                            }}>
                                {product.name}
                            </h1>

                            <p style={{
                                fontFamily: F.display, fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                                fontWeight: 700, color: C.white, margin: "0 0 20px",
                            }}>
                                {fmt(product.price)}
                            </p>

                            {/* Stock badge */}
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: 6,
                                padding: "5px 12px", borderRadius: 20,
                                border: `1px solid ${C.white}`, marginBottom: 24,
                            }}>
                                <span style={{ color: C.white, fontSize: 12 }}>✓</span>
                                <span style={{ fontSize: 11, color: C.white, fontWeight: 500 }}>
                                    In stock ({maxQty} available)
                                </span>
                            </div>

                            {/* Description */}
                            {product.description && (
                                <div style={{ marginBottom: 24 }}>
                                    <h3 style={{ fontSize: 14, fontWeight: 600, color: C.white, margin: "0 0 8px" }}>
                                        Description
                                    </h3>
                                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: 0 }}>
                                        {product.description}
                                    </p>
                                </div>
                            )}

                            {/* Quantity stepper */}
                            <div style={{ marginBottom: 24 }}>
                                <h3 style={{ fontSize: 14, fontWeight: 600, color: C.white, margin: "0 0 10px" }}>
                                    Quantity
                                </h3>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ display: "flex", alignItems: "center", background: C.white, borderRadius: 8, overflow: "hidden" }}>
                                        <button onClick={decrement} style={stepperBtn}>−</button>
                                        <span style={{ width: 44, textAlign: "center", fontSize: 14, fontWeight: 600, color: C.dark }}>
                                            {qty}
                                        </span>
                                        <button onClick={increment} style={stepperBtn}>+</button>
                                    </div>
                                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Max: {maxQty}</span>
                                </div>
                            </div>

                            {/* Add to cart */}
                            <button onClick={handleAddToCart} disabled={busy} style={{
                                ...darkBtn, width: "100%", marginBottom: 24,
                                background: added ? C.green : C.dark,
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                transition: "background 0.3s", opacity: busy ? 0.7 : 1,
                            }}>
                                🛒 {added ? `Added ${qty} to Cart!` : busy ? "Adding…" : "Add to Cart"}
                            </button>

                            {/* Perks */}
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {PERKS.map(perk => (
                                    <li key={perk} style={{
                                        display: "flex", alignItems: "center", gap: 8,
                                        marginBottom: 8, fontSize: 12, color: "rgba(255,255,255,0.8)",
                                    }}>
                                        <span style={{ color: C.green, fontWeight: 700 }}>✓</span>
                                        {perk}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Related products */}
                    {related.length > 0 && (
                        <div>
                            <h2 style={{
                                fontFamily: F.display, fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                                fontWeight: 700, color: C.white, margin: "0 0 28px", fontStyle: "italic",
                            }}>
                                Other Products
                            </h2>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 220px))", gap: 20 }}>
                                {related.map(p => (
                                    <OtherProductCard key={p.id} product={p} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

const darkBtn = {
    background: C.dark, color: C.white, border: "none",
    padding: "14px 24px", borderRadius: 8, fontSize: 13,
    fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontFamily: F.sans,
};

const stepperBtn = {
    width: 36, height: 36, background: "transparent", border: "none",
    fontSize: 18, cursor: "pointer", fontWeight: 600, color: C.dark, lineHeight: 1,
};
