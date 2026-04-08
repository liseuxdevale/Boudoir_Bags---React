import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

const F = { display: "'Playfair Display', serif", sans: "'Montserrat', sans-serif" };

const NAV = [
    { key: "dashboard", label: "Dashboard", href: "/admin",          icon: "⊞" },
    { key: "products",  label: "Products",  href: "/admin/products", icon: "𖠩" },
    { key: "orders",    label: "Orders",    href: "/admin/orders",   icon: "🛒" },
];

export default function AdminLayout({ children, activePage }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [userMenu, setUserMenu] = useState(false);

    return (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: F.sans }}>
            {/* Sidebar */}
            <aside style={{
                width: 200, background: "#ffffff",
                borderRight: "1px solid #f0ece6",
                display: "flex", flexDirection: "column",
                position: "sticky", top: 0, height: "100vh",
                boxShadow: "2px 0 12px rgba(0,0,0,0.04)",
            }}>
                {/* Logo — clicking navigates to landing page */}
                <div style={{ padding: "28px 24px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <Link href="/" style={{ textDecoration: "none" }}>
                            <span style={{ fontSize: 22, fontWeight: 900, fontFamily: F.display, color: "#000000", letterSpacing: -0.5, cursor: "pointer" }}>
                                𝔅oudoir
                            </span>
                        </Link>
                    </div>
                    <p style={{ margin: 0, fontSize: 9, color: "#555", letterSpacing: 2.5, textTransform: "uppercase" }}>Admin Panel</p>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: "8px 16px" }}>
                    {NAV.map(item => {
                        const active = activePage === item.key;
                        return (
                            <Link key={item.key} href={item.href} style={{
                                display: "flex", alignItems: "center", gap: 12,
                                padding: "12px 12px", borderRadius: 10, marginBottom: 4,
                                textDecoration: "none", fontSize: 13, fontWeight: active ? 600 : 400,
                                color: active ? "#1a1a1a" : "#4a4a4a",
                                background: active ? "#f5f0e8" : "transparent",
                                transition: "all 0.18s",
                            }}>
                                <span style={{ fontSize: 16 }}>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User */}
                <div style={{ position: "relative" }}>
                    {/* Logout popup */}
                    {userMenu && (
                        <div style={{
                            position: "absolute", bottom: "100%", left: 16, right: 16,
                            background: "#fff", borderRadius: 10, marginBottom: 8,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.12)", overflow: "hidden",
                            border: "1px solid #f0ece6",
                        }}>
                            <button
                                onClick={() => router.post("/logout")}
                                style={{
                                    width: "100%", padding: "12px 16px", background: "none",
                                    border: "none", textAlign: "left", fontSize: 13,
                                    fontWeight: 600, color: "#e8635a", cursor: "pointer",
                                    fontFamily: F.sans, display: "flex", alignItems: "center", gap: 8,
                                }}>
                                🚪 Log Out
                            </button>
                        </div>
                    )}

                    {/* User row */}
                    <div
                        onClick={() => setUserMenu(m => !m)}
                        style={{
                            padding: "16px 20px", borderTop: "1px solid #f0ece6",
                            display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                        }}>
                        <div style={{
                            width: 34, height: 34, borderRadius: "50%",
                            background: "#c8a96e", display: "flex", alignItems: "center",
                            justifyContent: "center", fontSize: 14, color: "#fff", fontWeight: 700,
                            flexShrink: 0,
                        }}>
                            {user?.name?.[0] ?? "A"}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#1a1a1a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {user?.name ?? "Admin"}
                            </p>
                            <p style={{ margin: 0, fontSize: 10, color: "#aaa", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {user?.email ?? ""}
                            </p>
                        </div>
                        <span style={{ fontSize: 10, color: "#aaa" }}>{userMenu ? "▾" : "▴"}</span>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main style={{ flex: 1, overflow: "auto" }}>
                {children}
            </main>
        </div>
    );
}
