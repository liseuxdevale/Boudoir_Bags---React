// FILE: resources/js/Pages/LandingPage.jsx

import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";


const COLORS = {
    sand: "#c8a96e", sandLight: "#e8d5b0", cream: "#f5f0e8",
    dark: "#1a1a1a", white: "#ffffff", coral: "#e8635a",
    muted: "#6b6056", cardBg: "#f0ebe0",
};
const FONTS = {
    display: "'Playfair Display', serif",
    body: "'Cormorant Garamond', serif",
    sans: "'Montserrat', sans-serif",
};

const NAV_LINKS = [
    { label: "Home",     href: "/" },
    { label: "Shop",     href: "/shop" },
    { label: "Deals",    href: "/shop" },
    { label: "About Us", href: "#footer" },
    { label: "Contact",  href: "#footer" },
];

const TRUST_BADGES = [
    { icon: "✦", label: "Premium Quality",  sub: "Crafted from finest materials" },
    { icon: "◎", label: "Free Shipping",     sub: "On orders over ₱2,500" },
    { icon: "◈", label: "Secure Payment",    sub: "100% secure transactions" },
];

const FOOTER_COLS = [
    { title: "About Boudoir",    isText: true,  items: ["Your destination for premium quality bags. From everyday essentials to luxury statement pieces."] },
    { title: "Quick Links",      items: ["All Products", "About", "Deals", "Shopping Cart"], paths: ["/shop", "#footer", "/shop", "/cart"] },
    { title: "Customer Service", items: ["Contact Us", "Shipping Information", "Returns & Exchanges", "FAQs"], paths: ["#footer","#","#","#"] },
    { title: "Connect With Us",  items: ["Facebook", "Instagram", "Twitter", "Email"], paths: ["#","#","#","#"] },
];

const FALLBACK_PRODUCTS = [
    { id: 1, name: "Brianna Leather Handbag", category: { name: "Handbags" },  price: "2999.00", images: [{ url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80" }] },
    { id: 7, name: "Classic Backpack",        category: { name: "Backpacks" }, price: "2300.00", images: [{ url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80" }] },
    { id: 4, name: "Lexi Belt Tote Bag",      category: { name: "Tote Bags" }, price: "1499.00", images: [{ url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80" }] },
];

const FALLBACK_CATEGORIES = [
    { id: 1, name: "Handbags",        image_url: "https://i.pinimg.com/1200x/ca/78/0a/ca780a000b612dba309f2fd561dd364a.jpg" },
    { id: 2, name: "Tote Bags",       image_url: "https://images.unsplash.com/photo-1614179689702-355944cd0918?w=600&q=80" },
    { id: 3, name: "Backpacks",       image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80" },
    { id: 4, name: "Cross Body Bags", image_url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80" },
    { id: 5, name: "Shoulder Bags",   image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80" },
    { id: 6, name: "Clutch Bags",     image_url: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80" },
    { id: 7, name: "Travel Bags",     image_url: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=600&q=80" },
    { id: 8, name: "Messenger Bags",  image_url: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=600&q=80" },
];

function formatPrice(price) {
    return `₱${Number(price).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

function getProductImage(product) {
    const first = product.images?.[0];
    if (!first) return "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80";
    return typeof first === "string" ? first : (first.url ?? first.image_url ?? first.path ?? "");
}

function getCategoryImage(category) {
    return category.image_url ?? category.img ?? "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80";
}

function getCategoryName(product) {
    if (!product.category) return "";
    return typeof product.category === "string" ? product.category : (product.category.name ?? "");
}

function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

const heroPrimaryBtn = {
    background: COLORS.dark, color: COLORS.white, border: "none",
    padding: "15px 36px", fontSize: 13, fontWeight: 600, letterSpacing: 2,
    textTransform: "uppercase", borderRadius: 4, cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif", transition: "all 0.2s",
};
const heroSecondaryBtn = {
    background: "transparent", color: COLORS.dark, border: `2px solid ${COLORS.dark}`,
    padding: "13px 34px", fontSize: 13, fontWeight: 600, letterSpacing: 2,
    textTransform: "uppercase", borderRadius: 4, cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif", transition: "all 0.2s",
};
const navIconBtn = {
    background: "none", border: "none", fontSize: 18,
    cursor: "pointer", color: COLORS.dark, padding: "4px 6px",
};
const navOutlineBtn = {
    background: "transparent", color: COLORS.dark, border: `1.5px solid ${COLORS.dark}`,
    padding: "6px 18px", fontSize: 12, fontWeight: 600, borderRadius: 20,
    cursor: "pointer", letterSpacing: 0.5, fontFamily: "'Montserrat', sans-serif",
};
const navFillBtn = {
    background: COLORS.dark, color: COLORS.white, border: "none",
    padding: "7px 18px", fontSize: 12, fontWeight: 600, borderRadius: 20,
    cursor: "pointer", letterSpacing: 0.5, fontFamily: "'Montserrat', sans-serif",
};
const outlineBtn = {
    background: "transparent", border: `2px solid ${COLORS.dark}`,
    padding: "12px 32px", fontSize: 13, fontWeight: 600, letterSpacing: 2,
    textTransform: "uppercase", borderRadius: 4, cursor: "pointer",
    color: COLORS.dark, fontFamily: "'Montserrat', sans-serif", transition: "all 0.2s",
};
const sectionTitle = {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700,
    color: COLORS.dark, textTransform: "uppercase", letterSpacing: 3, margin: "0 0 10px",
};
const sectionSub = {
    fontFamily: "'Montserrat', sans-serif", fontSize: 13,
    color: COLORS.muted, letterSpacing: 1, margin: 0,
};

function Navbar({ auth }) {
    const [scrolled, setScrolled]     = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchVal,  setSearchVal]  = useState("");

    const user    = auth?.user ?? null;
    const isAdmin = user?.role === "admin";

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleSearch = (e) => {
        if (e.key === "Enter" && searchVal.trim()) {
            router.visit(`/shop?q=${encodeURIComponent(searchVal.trim())}`);
            setSearchOpen(false);
            setSearchVal("");
        }
    };

    const handleLogout = () => router.post("/logout");

    const handleNavClick = (e, href) => {
        if (href === "#footer") {
            e.preventDefault();
            document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <nav style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 5%", height: 64,
            background: scrolled ? "rgba(245,240,232,0.97)" : "rgba(245,240,232,0.85)",
            backdropFilter: "blur(10px)",
            boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
            transition: "all 0.3s ease", fontFamily: FONTS.sans,
        }}>
            <Link href="/" style={{
                fontFamily: FONTS.display, fontSize: 22, fontWeight: 700,
                color: COLORS.dark, letterSpacing: 1, textDecoration: "none",
            }}>
                𝔅oudoir
            </Link>

            <ul style={{ display: "flex", gap: 32, listStyle: "none", margin: 0, padding: 0 }}>
                {NAV_LINKS.map(link => (
                    <li key={link.label}>
                        <Link
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            style={{
                                textDecoration: "none", color: COLORS.dark, fontSize: 12,
                                fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase",
                            }}
                            onMouseEnter={e => e.target.style.color = COLORS.sand}
                            onMouseLeave={e => e.target.style.color = COLORS.dark}>
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {searchOpen ? (
                    <input autoFocus value={searchVal}
                        onChange={e => setSearchVal(e.target.value)}
                        onKeyDown={handleSearch}
                        onBlur={() => { setSearchOpen(false); setSearchVal(""); }}
                        placeholder="Search… (Enter)"
                        style={{
                            padding: "6px 12px", border: `1px solid ${COLORS.sandLight}`,
                            borderRadius: 20, fontSize: 12, fontFamily: FONTS.sans,
                            outline: "none", width: 180,
                        }} />
                ) : (
                    <button style={navIconBtn} onClick={() => setSearchOpen(true)}>⌕</button>
                )}

                <Link href="/cart" style={{ ...navIconBtn, textDecoration: "none" }}>🛒</Link>

                {user ? (
                    <>
                        {isAdmin && (
                            <Link href="/admin" style={{ ...navFillBtn, textDecoration: "none", display: "inline-block" }}>
                                Admin
                            </Link>
                        )}
                        <span style={{ fontSize: 12, color: COLORS.dark }}>👤 {user.name}</span>
                        <button style={navOutlineBtn} onClick={handleLogout}>Log Out</button>
                    </>
                ) : (
                    <>
                        <Link href="/login"    style={{ ...navFillBtn,    textDecoration: "none" }}>Login</Link>
                        <Link href="/register" style={{ ...navOutlineBtn, textDecoration: "none" }}>Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

function Hero() {
    return (
        <section style={{
            position: "relative", minHeight: "90vh",
            background: `linear-gradient(135deg, ${COLORS.sandLight} 0%, ${COLORS.cream} 60%, #d4b896 100%)`,
            display: "flex", alignItems: "center", paddingTop: 64,
            overflow: "hidden", fontFamily: FONTS.sans,
        }}>
            <div style={{
                position: "absolute", top: "10%", right: "5%", width: 320, height: 320,
                borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
                background: "radial-gradient(ellipse, #c0392b88 0%, transparent 70%)",
                filter: "blur(2px)", pointerEvents: "none",
            }} />
            <div style={{
                position: "absolute", top: "30%", right: "15%", width: 180, height: 180,
                borderRadius: "50% 70% 40% 60% / 60% 40% 70% 30%",
                background: "radial-gradient(ellipse, #8b000055 0%, transparent 70%)",
                filter: "blur(3px)", pointerEvents: "none",
            }} />

            <div style={{
                position: "relative", zIndex: 2,
                width: "100%", textAlign: "center",
                paddingLeft: "5%", paddingRight: "30%",
            }}>
                <h1 style={{
                    fontFamily: FONTS.display, fontWeight: 900,
                    fontSize: "clamp(3rem, 6vw, 5.5rem)", lineHeight: 1.05,
                    color: COLORS.dark, margin: "0 0 8px", textTransform: "uppercase",
                    textShadow: "1px 2px 8px rgba(0,0,0,0.2)",
                }}>
                    Elevate Your Styles
                </h1>
                <p style={{
                    fontFamily: FONTS.body, fontStyle: "italic",
                    fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: COLORS.dark, margin: "0 0 8px",
                    textShadow: "1px 2px 6px rgba(0,0,0,0.15)",
                }}>
                    with
                </p>
                <h2 style={{
                    fontFamily: FONTS.display, fontWeight: 900,
                    fontSize: "clamp(2rem, 4vw, 3.5rem)", color: COLORS.dark,
                    margin: "0 0 36px", textTransform: "uppercase", letterSpacing: 2,
                    textShadow: "1px 2px 8px rgba(0,0,0,0.2)",
                }}>
                    𝔅oudoir Bags
                </h2>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
                    <button onClick={() => router.visit("/shop")} style={heroPrimaryBtn}
                        onMouseEnter={e => { e.target.style.background = COLORS.coral; }}
                        onMouseLeave={e => { e.target.style.background = COLORS.dark; }}>
                        Shop Now →
                    </button>
                    <button onClick={() => scrollTo("shop-by-category")} style={heroSecondaryBtn}
                        onMouseEnter={e => { e.target.style.background = COLORS.dark; e.target.style.color = COLORS.white; }}
                        onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = COLORS.dark; }}>
                        View Collection
                    </button>
                </div>
            </div>

            <div style={{
                position: "absolute", right: 0, top: "-20%", bottom: 0, left: "40%",
                pointerEvents: "none",
            }}>
                <img
                    src="/image.png"
                    alt="Featured bag"
                    style={{
                        width: "100%", height: "100%",
                        objectFit: "contain", objectPosition: "right center",
                    }}
                />
            </div>
        </section>
    );
}

function TrustBadges() {
    return (
        <section style={{
            background: COLORS.white, padding: "20px 5%",
            display: "flex", justifyContent: "center", gap: 0,
            borderBottom: `1px solid ${COLORS.sandLight}`,
        }}>
            {TRUST_BADGES.map((badge, i) => (
                <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 40px",
                    borderRight: i < TRUST_BADGES.length - 1 ? `1px solid ${COLORS.sandLight}` : "none",
                    fontFamily: FONTS.sans,
                }}>
                    <span style={{ fontSize: 22, color: COLORS.sand }}>{badge.icon}</span>
                    <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: COLORS.dark, letterSpacing: 0.5 }}>
                            {badge.label}
                        </p>
                        <p style={{ margin: 0, fontSize: 11, color: COLORS.muted }}>{badge.sub}</p>
                    </div>
                </div>
            ))}
        </section>
    );
}

function ProductCard({ product, onClick }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: COLORS.white, borderRadius: 16, overflow: "hidden",
                boxShadow: hovered ? "0 16px 48px rgba(0,0,0,0.15)" : "0 4px 20px rgba(0,0,0,0.06)",
                transform: hovered ? "translateY(-6px)" : "translateY(0)",
                transition: "all 0.3s ease", cursor: "pointer",
            }}>
            <div style={{ height: 420, overflow: "hidden", background: COLORS.cardBg }}>
                <img src={getProductImage(product)} alt={product.name} style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    transform: hovered ? "scale(1.06)" : "scale(1)",
                    transition: "transform 0.4s ease",
                }} />
            </div>
            <div style={{ padding: "18px 20px 22px", fontFamily: FONTS.sans }}>
                <p style={{ margin: "0 0 4px", fontSize: 11, color: COLORS.sand, letterSpacing: 1.5, textTransform: "uppercase" }}>
                    {getCategoryName(product)}
                </p>
                <p style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 600, color: COLORS.dark }}>
                    {product.name}
                </p>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: COLORS.dark, fontFamily: FONTS.sans }}>
                    {formatPrice(product.price)}
                </p>
            </div>
        </div>
    );
}

function FeaturedProducts({ products = [] }) {
    const items = products.length ? products : FALLBACK_PRODUCTS;

    return (
        <section style={{
            background: COLORS.cream, padding: "70px 5%",
            fontFamily: FONTS.sans, position: "relative", overflow: "hidden",
        }}>
            <div style={{
                position: "absolute", bottom: "5%", left: "3%", width: 200, height: 200,
                borderRadius: "40% 60% 50% 70%",
                background: "radial-gradient(ellipse, #c0392b22 0%, transparent 70%)",
                pointerEvents: "none",
            }} />
            <div style={{ textAlign: "center", marginBottom: 50 }}>
                <h2 style={sectionTitle}>Featured Products</h2>
                <p style={sectionSub}>Discover our most popular bags</p>
            </div>
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 32, maxWidth: 1300, margin: "0 auto",
            }}>
                {items.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onClick={() => router.visit(`/product/${product.id}`)}
                    />
                ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 48 }}>
                <button
                    onClick={() => router.visit("/shop")}
                    style={outlineBtn}
                    onMouseEnter={e => { e.target.style.background = COLORS.dark; e.target.style.color = COLORS.white; }}
                    onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = COLORS.dark; }}>
                    View All Products
                </button>
            </div>
        </section>
    );
}

function CategoryCard({ category, onClick }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: COLORS.white, borderRadius: 20, overflow: "hidden",
                boxShadow: hovered ? "0 20px 50px rgba(0,0,0,0.13)" : "0 4px 18px rgba(0,0,0,0.07)",
                transform: hovered ? "translateY(-5px)" : "translateY(0)",
                transition: "all 0.35s ease", cursor: "pointer",
            }}>
            <div style={{ height: 480, overflow: "hidden", background: COLORS.cardBg }}>
                <img src={getCategoryImage(category)} alt={category.name} style={{
                    width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top",
                    transform: hovered ? "scale(1.07)" : "scale(1)",
                    transition: "transform 0.4s ease",
                }} />
            </div>
            <div style={{ padding: "18px 20px 22px", background: "#f7f3ea", textAlign: "center" }}>
                <p style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 600, color: COLORS.dark }}>
                    {category.name}
                </p>
                {category.products_count != null && (
                    <p style={{ margin: 0, fontSize: 12, color: COLORS.muted }}>
                        {category.products_count} in stock
                    </p>
                )}
            </div>
        </div>
    );
}

function ShopByCategory({ categories = [] }) {
    const items = categories.length ? categories : FALLBACK_CATEGORIES;

    return (
        <section id="shop-by-category" style={{
            background: `linear-gradient(180deg, ${COLORS.sandLight}55 0%, ${COLORS.cream} 100%)`,
            padding: "70px 5%", fontFamily: FONTS.sans,
        }}>
            <div style={{ textAlign: "center", marginBottom: 50 }}>
                <h2 style={sectionTitle}>Shop By Category</h2>
                <p style={sectionSub}>Find the perfect bag for every occasion</p>
            </div>
            <div style={{
                display: "flex", flexWrap: "wrap", justifyContent: "center",
                gap: 32, maxWidth: 1400, margin: "0 auto",
            }}>
                {items.map(cat => (
                    <CategoryCard
                        key={cat.id}
                        category={cat}
                        onClick={() => router.visit(`/shop?category=${encodeURIComponent(cat.name)}`)}
                    />
                ))}
            </div>
        </section>
    );
}

function CTABanner() {
    return (
        <section style={{
            background: `linear-gradient(135deg, ${COLORS.coral} 0%, #c0392b 100%)`,
            padding: "80px 5%", textAlign: "center", fontFamily: FONTS.sans,
        }}>
            <h2 style={{
                fontFamily: FONTS.display, fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 900, color: COLORS.white, textTransform: "uppercase",
                letterSpacing: 2, margin: "0 0 16px",
            }}>
                Ready to Find Your Perfect Bag?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, margin: "0 0 36px" }}>
                Explore our collection and discover new favorite bags!
            </p>
            <button
                onClick={() => router.visit("/shop")}
                style={{
                    background: COLORS.dark, color: COLORS.white, border: "none",
                    padding: "14px 40px", fontSize: 13, fontWeight: 600, letterSpacing: 2,
                    textTransform: "uppercase", borderRadius: 4, cursor: "pointer",
                    transition: "all 0.2s", fontFamily: FONTS.sans,
                }}
                onMouseEnter={e => { e.target.style.background = COLORS.white; e.target.style.color = COLORS.dark; }}
                onMouseLeave={e => { e.target.style.background = COLORS.dark;  e.target.style.color = COLORS.white; }}>
                Shop Now →
            </button>
        </section>
    );
}

function Footer() {
    return (
        <footer id="footer" style={{
            background: COLORS.dark, color: COLORS.white,
            padding: "60px 5% 30px", fontFamily: FONTS.sans,
        }}>
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 40, marginBottom: 48,
            }}>
                {FOOTER_COLS.map((col, i) => (
                    <div key={i}>
                        <p style={{
                            fontSize: 12, fontWeight: 600, letterSpacing: 2,
                            textTransform: "uppercase", color: COLORS.sand, marginBottom: 16,
                        }}>
                            {col.title}
                        </p>
                        {col.isText ? (
                            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>
                                {col.items[0]}
                            </p>
                        ) : (
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {col.items.map((item, j) => (
                                    <li key={item} style={{ marginBottom: 10 }}>
                                        <Link
                                            href={col.paths?.[j] || "#"}
                                            style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none", fontSize: 13 }}
                                            onMouseEnter={e => e.target.style.color = COLORS.sand}
                                            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.55)"}>
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                    © 2026 Boudoir. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

function GoogleFonts() {
    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,400;1,400&family=Montserrat:wght@400;500;600&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }, []);
    return null;
}

export default function LandingPage({ featured = [], categories = [] }) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Home" />
            <GoogleFonts />
            <div style={{ fontFamily: FONTS.sans, overflowX: "hidden" }}>
                <Navbar auth={auth} />
                <Hero />
                <TrustBadges />
                <FeaturedProducts products={featured} />
                <ShopByCategory categories={categories} />
                <CTABanner />
                <Footer />
            </div>
        </>
    );
}
