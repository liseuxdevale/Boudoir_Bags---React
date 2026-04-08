import { Link } from "@inertiajs/react";

const C = { sand: "#c8a96e", sandLight: "#e8d5b0", cream: "#f5f0e8", dark: "#1a1a1a", muted: "#6b6056", white: "#ffffff" };
const F = { sans: "'Montserrat', sans-serif" };

const FOOTER_COLS = [
    { title: "About Boudoir",    isText: true,  items: ["Your destination for premium quality bags. From everyday essentials to luxury statement pieces."] },
    { title: "Quick Links",      items: ["All Products", "About", "Deals", "Shopping Cart"],        paths: ["/shop", "#", "/shop", "/cart"] },
    { title: "Customer Service", items: ["Contact Us", "Shipping Information", "Returns & Exchanges", "FAQs"], paths: ["#", "#", "#", "#"] },
    { title: "Connect With Us",  items: ["Facebook", "Instagram", "Twitter", "Email"],              paths: ["#", "#", "#", "#"] },
];

export default function Footer() {
    return (
        <footer style={{ background: C.cream, fontFamily: F.sans }}>
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 40, padding: "50px 5% 40px", borderTop: `1px solid ${C.sandLight}`,
            }}>
                {FOOTER_COLS.map((col, i) => (
                    <div key={i}>
                        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: C.dark, marginBottom: 14 }}>
                            {col.title}
                        </p>
                        {col.isText ? (
                            <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.7, margin: 0 }}>{col.items[0]}</p>
                        ) : (
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {col.items.map((item, j) => (
                                    <li key={item} style={{ marginBottom: 8 }}>
                                        <Link href={col.paths?.[j] || "#"} style={{ color: C.muted, textDecoration: "none", fontSize: 12 }}>
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
            <div style={{ background: C.sand, padding: "16px 5%", textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.white }}>© 2026 Boudoir. All rights reserved.</p>
            </div>
        </footer>
    );
}
