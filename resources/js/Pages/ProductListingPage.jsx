// FILE: resources/js/Pages/ProductListingPage.jsx

import { Head, router } from "@inertiajs/react";
import { useCallback, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const C = {
    sand: "#c8a96e", sandLight: "#e8d5b0", cream: "#f5f0e8",
    dark: "#1a1a1a", white: "#ffffff", coral: "#e8635a",
    muted: "#6b6056", pageBg: "#c4a882",
};
const F = { display: "'Playfair Display', serif", sans: "'Montserrat', sans-serif" };

const selectStyle = {
    padding: "10px 36px 10px 14px",
    border: `1px solid ${C.sandLight}`,
    borderRadius: 6,
    background: C.white,
    fontSize: 13,
    color: C.dark,
    fontFamily: F.sans,
    cursor: "pointer",
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b6056' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    minWidth: 160,
};

export default function ProductListingPage({ products, categories, filters }) {
    const safeCategories = Array.isArray(categories) ? categories : [];
    const safeFilters    = (filters && typeof filters === "object" && !Array.isArray(filters))
        ? filters : {};

    const [search,   setSearch]   = useState(safeFilters.q        ?? "");
    const [category, setCategory] = useState(safeFilters.category ?? "All");
    const [sort,     setSort]     = useState(safeFilters.sort     ?? "default");

    const applyFilters = (overrides = {}) => {
        const params = {
            q:        overrides.q        !== undefined ? overrides.q        : search,
            category: overrides.category !== undefined ? overrides.category : category,
            sort:     overrides.sort     !== undefined ? overrides.sort     : sort,
        };
        if (!params.q)                 delete params.q;
        if (params.category === "All") delete params.category;
        if (params.sort === "default") delete params.sort;
        router.get("/shop", params, { preserveScroll: true, replace: true });
    };

    // Debounce: waits 300ms after user stops typing before firing request
    const debounceTimer = useCallback((() => {
        let timer;
        return (fn, delay) => {
            clearTimeout(timer);
            timer = setTimeout(fn, delay);
        };
    })(), []);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        debounceTimer(() => applyFilters({ q: val }), 300);
    };

    const handleCategory  = (val) => { setCategory(val); applyFilters({ category: val }); };
    const handleSort      = (val) => { setSort(val);     applyFilters({ sort: val });     };

    const items    = products?.data      ?? [];
    const total    = products?.total     ?? 0;
    const lastPage = products?.last_page ?? 1;
    const links    = products?.links     ?? [];

    const fmt = (n) =>
        `₱${Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

    return (
        <>
            <Head title="Shop" />
            <div style={{ fontFamily: F.sans, background: C.pageBg, minHeight: "100vh" }}>
                <Navbar />
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "50px 4% 80px" }}>

                    <div style={{ marginBottom: 28 }}>
                        <h1 style={{
                            fontFamily: F.display, fontWeight: 900,
                            fontSize: "clamp(2.2rem,4vw,3.2rem)",
                            color: C.white, textTransform: "uppercase",
                            letterSpacing: 3, margin: "0 0 6px",
                            textShadow: "1px 2px 8px rgba(0,0,0,0.18)",
                        }}>Our Collection</h1>
                        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, letterSpacing: 1, margin: 0 }}>
                            Browse our curated selection of premium bags
                        </p>
                    </div>

                    <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
                        <div style={{ position: "relative", flex: "1 1 280px", maxWidth: 420 }}>
                            <input
                                type="text"
                                placeholder="Search Products"
                                value={search}
                                onChange={handleSearchChange}
                                onKeyDown={(e) => { if (e.key === "Enter") applyFilters({ q: search }); }}
                                style={{
                                    width: "100%", padding: "10px 40px 10px 16px",
                                    border: `1px solid ${C.sandLight}`, borderRadius: 6,
                                    background: C.white, fontSize: 13, color: C.dark,
                                    fontFamily: F.sans, outline: "none", boxSizing: "border-box",
                                }}
                            />
                            <span
                                onClick={() => applyFilters({ q: search })}
                                style={{
                                    position: "absolute", right: 14, top: "50%",
                                    transform: "translateY(-50%)", color: C.muted,
                                    fontSize: 16, cursor: "pointer",
                                }}>⌕</span>
                        </div>
                        <div style={{ flex: 1 }} />
                        <select value={category} onChange={(e) => handleCategory(e.target.value)} style={selectStyle}>
                            <option value="All">All</option>
                            {safeCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <select value={sort} onChange={(e) => handleSort(e.target.value)} style={selectStyle}>
                            <option value="default">Default</option>
                            <option value="low-high">Low to High</option>
                            <option value="high-low">High to Low</option>
                        </select>
                    </div>

                    {category !== "All" && (
                        <h2 style={{
                            fontFamily: F.display, fontSize: "clamp(1.4rem,2.5vw,2rem)",
                            fontWeight: 700, color: C.white, margin: "0 0 8px",
                        }}>{category}</h2>
                    )}

                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginBottom: 28 }}>
                        Showing {items.length} of {total} products
                    </p>

                    {items.length > 0 ? (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                            {items.map((product) => (
                                <ProductCard key={product.id} product={product} fmt={fmt} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "80px 0", color: C.white }}>
                            <p style={{ fontSize: 18, fontFamily: F.display, marginBottom: 8 }}>No products found</p>
                            <p style={{ fontSize: 13, opacity: 0.7 }}>Try adjusting your search or filter</p>
                        </div>
                    )}

                    {lastPage > 1 && (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 48 }}>
                            {links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => { if (link.url) { window.scrollTo({ top: 0, behavior: "smooth" }); router.visit(link.url, { preserveScroll: false }); } }}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    style={{
                                        padding: "8px 16px", border: "none", borderRadius: 4,
                                        fontSize: 13, fontWeight: 500,
                                        cursor: link.url ? "pointer" : "not-allowed",
                                        fontFamily: F.sans,
                                        background: link.active ? C.dark : link.url ? C.coral : "#ccc",
                                        color: link.url || link.active ? C.white : "#999",
                                        opacity: link.url ? 1 : 0.5,
                                        minWidth: 36,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <Footer />
            </div>
        </>
    );
}

function ProductCard({ product, fmt }) {
    const [hovered, setHovered] = useState(false);

    const img =
        product.images?.[0]?.image_url ??
        product.images?.[0]?.url       ??
        product.img                    ??
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80";

    const categoryName =
        typeof product.category === "string"
            ? product.category
            : product.category?.name ?? "";

    return (
        <div
            onClick={() => router.visit(`/product/${product.id}`)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: C.white, borderRadius: 16, overflow: "hidden",
                boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.15)" : "0 4px 16px rgba(0,0,0,0.07)",
                transform: hovered ? "translateY(-5px)" : "translateY(0)",
                transition: "all 0.3s ease", cursor: "pointer",
            }}
        >
            <div style={{ height: 380, overflow: "hidden", background: "linear-gradient(180deg,#c8c8c8 0%,#e8e8e8 100%)" }}>
                <img src={img} alt={product.name} style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    transform: hovered ? "scale(1.06)" : "scale(1)",
                    transition: "transform 0.4s ease",
                }} />
            </div>
            <div style={{ padding: "16px 18px 20px" }}>
                <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: C.dark, fontFamily: F.display }}>
                    {product.name}
                </p>
                <p style={{ margin: "0 0 10px", fontSize: 11, color: C.muted, letterSpacing: 0.5 }}>
                    {categoryName}
                </p>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.dark }}>
                    {fmt(product.price)}
                </p>
            </div>
        </div>
    );
}
