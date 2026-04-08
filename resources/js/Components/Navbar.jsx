// FILE: resources/js/components/Navbar.jsx

import { Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

const C = { sand: "#c8a96e", dark: "#1a1a1a", coral: "#e8635a", cream: "#f5f0e8", sandLight: "#e8d5b0", white: "#ffffff" };
const F = { display: " serif", sans: "'Montserrat', sans-serif" };

const NAV_LINKS = [
    { label: "Home",     href: "/" },
    { label: "Shop",     href: "/shop" },
    { label: "Deals",    href: "/shop" },
    { label: "About Us", href: "#" },
    { label: "Contact",  href: "#" },
];

export default function Navbar() {
    // auth is shared globally from HandleInertiaRequests middleware
    const { auth, cart } = usePage().props;

    const user    = auth?.user ?? null;
    const isAdmin = user?.role === "admin";
    const totalItems = cart?.total_items ?? 0;

    const [scrolled,    setScrolled]    = useState(false);
    const [searchOpen,  setSearchOpen]  = useState(false);
    const [searchVal,   setSearchVal]   = useState("");

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

    return (
        <nav style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 5%", height: 64,
            background: scrolled ? "rgba(245,240,232,0.97)" : C.cream,
            backdropFilter: "blur(10px)",
            boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : `0 1px 0 ${C.sandLight}`,
            fontFamily: F.sans, position: "sticky", top: 0, zIndex: 100,
            transition: "all 0.3s ease",
        }}>
            {/* Logo */}
            <Link href="/" style={{
                fontFamily: F.display, fontSize: 22, fontWeight: 700,
                color: C.dark, letterSpacing: 1, textDecoration: "none",
            }}>
                𝔅oudoir
            </Link>

            {/* Nav links */}
            <ul style={{ display: "flex", gap: 36, listStyle: "none", margin: 0, padding: 0 }}>
                {NAV_LINKS.map(link => (
                    <li key={link.label}>
                        <Link href={link.href} style={{
                            color: C.dark, fontSize: 12, fontWeight: 500,
                            letterSpacing: 1.5, textTransform: "uppercase", textDecoration: "none",
                        }}
                            onMouseEnter={e => e.target.style.color = C.sand}
                            onMouseLeave={e => e.target.style.color = C.dark}>
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Right actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Search */}
                {searchOpen ? (
                    <input autoFocus value={searchVal}
                        onChange={e => setSearchVal(e.target.value)}
                        onKeyDown={handleSearch}
                        onBlur={() => { setSearchOpen(false); setSearchVal(""); }}
                        placeholder="Search… (Enter)"
                        style={{
                            padding: "6px 12px", border: `1px solid ${C.sandLight}`,
                            borderRadius: 20, fontSize: 12, fontFamily: F.sans,
                            outline: "none", width: 200,
                        }} />
                ) : (
                    <button style={iconBtn} onClick={() => setSearchOpen(true)}>⌕</button>
                )}

                {/* Cart with badge */}
                <Link href="/cart" style={{ ...iconBtn, position: "relative", textDecoration: "none" }}>
                    🛒
                    {totalItems > 0 && (
                        <span style={{
                            position: "absolute", top: -4, right: -4,
                            background: C.coral, color: C.white,
                            fontSize: 10, fontWeight: 700, borderRadius: "50%",
                            width: 18, height: 18, display: "flex",
                            alignItems: "center", justifyContent: "center", lineHeight: 1,
                        }}>
                            {totalItems > 99 ? "99+" : totalItems}
                        </span>
                    )}
                </Link>

                {/* Auth */}
                {user ? (
                    <>
                        {isAdmin && (
                            <Link href="/admin" style={{ ...loginBtn, textDecoration: "none" }}>
                                Admin
                            </Link>
                        )}
                        <span style={{ fontSize: 12, color: C.dark }}>
                            👤 {user.name}
                        </span>
                        <button style={outlineBtn} onClick={handleLogout}>Log Out</button>
                    </>
                ) : (
                    <>
                        <Link href="/login"    style={{ ...loginBtn,   textDecoration: "none" }}>Login</Link>
                        <Link href="/register" style={{ ...outlineBtn, textDecoration: "none" }}>Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

const iconBtn = {
    background: "none", border: "none", fontSize: 18,
    cursor: "pointer", color: "#1a1a1a", padding: "4px 6px",
};
const loginBtn = {
    background: "#1a1a1a", color: "#fff", border: "none",
    padding: "7px 18px", fontSize: 12, fontWeight: 600,
    borderRadius: 20, cursor: "pointer", fontFamily: "'Montserrat', sans-serif",
};
const outlineBtn = {
    background: "transparent", color: "#1a1a1a", border: "1.5px solid #1a1a1a",
    padding: "6px 16px", fontSize: 12, fontWeight: 600,
    borderRadius: 20, cursor: "pointer", fontFamily: "'Montserrat', sans-serif",
};
