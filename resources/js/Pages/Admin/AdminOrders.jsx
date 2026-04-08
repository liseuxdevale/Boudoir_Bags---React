import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "./AdminLayout";

const F = { display: "'Playfair Display', serif", sans: "'Montserrat', sans-serif" };
const fmt = (n) => `₱${Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

const STATUS_STYLES = {
    pending:    { bg: "#fff8e1", color: "#f57c00" },
    confirmed:  { bg: "#e8f5e9", color: "#2e7d32" },
    shipping:   { bg: "#e0f7fa", color: "#00838f" },
    delivered:  { bg: "#f3e5f5", color: "#6a1b9a" },
    cancelled:  { bg: "#fce4ec", color: "#c62828" },
};

const STATUSES = ["pending", "confirmed", "shipping", "delivered", "cancelled"];

const TIMELINE = [
    { key: "pending",    color: "#FFB74D", label: "Pending",    desc: "Order placed and awaiting confirmation" },
    { key: "confirmed",  color: "#64B5F6", label: "Confirmed",  desc: "Order confirmed by admin" },
    { key: "shipping",   color: "#4DB6AC", label: "Shipping",   desc: "Order is being prepared" },
    { key: "delivered",  color: "#81C784", label: "Delivered",  desc: "Order delivered successfully" },
    { key: "cancelled",  color: "#E57373", label: "Cancelled",  desc: "Order has been cancelled" },
];

export default function AdminOrders({ orders = {}, filters = {} }) {
    const items    = orders.data    ?? [];
    const links    = orders.links   ?? [];
    const currPage = orders.current_page ?? 1;
    const lastPage = orders.last_page    ?? 1;

    const [search,       setSearch]       = useState(filters.q ?? "");
    const [statusFilter, setStatusFilter] = useState(filters.status ?? "");
    const [viewing,      setViewing]      = useState(null);
    const [newStatus,    setNewStatus]    = useState("");
    const [showDrop,     setShowDrop]     = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        router.get("/admin/orders", { q: e.target.value, status: statusFilter }, { preserveState: true, replace: true });
    };

    const handleStatusFilter = (s) => {
        setStatusFilter(s); setShowDrop(false);
        router.get("/admin/orders", { q: search, status: s }, { preserveState: true, replace: true });
    };

    const openView = (order) => { setViewing(order); setNewStatus(order.status); };

    const handleUpdateStatus = () => {
        if (!viewing) return;
        if (newStatus !== viewing.status) {
            router.patch(`/admin/orders/${viewing.id}/status`, { status: newStatus }, {
                preserveScroll: true,
                onSuccess: () => setViewing(null),
            });
        } else {
            setViewing(null);
        }
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/admin/orders/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const goPage = (url) => { if (url) router.visit(url); };

    return (
        <>
            <Head title="Admin Orders" />
            <AdminLayout activePage="orders">
                <div style={{
                    background: "linear-gradient(160deg, #c8a96e 0%, #c09070 45%, #b07868 100%)",
                    minHeight: "100vh", padding: "40px 44px",
                }}>
                    {/* Header */}
                    <div style={{ marginBottom: 28 }}>
                        <h1 style={{ fontFamily: F.display, fontWeight: 900, fontSize: 32, color: "#fff", margin: "0 0 4px" }}>Orders</h1>
                        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>Manage and Track Orders</p>
                    </div>

                    {/* Toolbar */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 16 }}>
                        <div style={{ position: "relative", flex: 1, maxWidth: 480 }}>
                            <input value={search} onChange={handleSearch} placeholder="Search products"
                                style={{ width: "100%", padding: "12px 44px 12px 18px", borderRadius: 30, border: "none", fontSize: 13, background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", outline: "none", boxSizing: "border-box" }} />
                            <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#aaa" }}></span>
                        </div>
                        {/* Status filter dropdown */}
                        <div style={{ position: "relative" }}>
                            <button onClick={() => setShowDrop(d => !d)} style={{
                                background: "#1a1a1a", color: "#fff", border: "none",
                            padding: "13px 30px", borderRadius: 10, fontSize: 13,
                            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                            fontFamily: F.sans,
                            }}>
                                {statusFilter ? statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1) : "All Status"}
                                <span>▾</span>
                            </button>
                            {showDrop && (
                                <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", background: "#fff", borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", zIndex: 50, minWidth: 160, overflow: "hidden" }}>
                                    <DropItem label="All Status" onClick={() => handleStatusFilter("")} active={!statusFilter} />
                                    {STATUSES.map(s => (
                                        <DropItem key={s} label={s.charAt(0).toUpperCase() + s.slice(1)} onClick={() => handleStatusFilter(s)} active={statusFilter === s} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.13)", marginBottom: 32 }}>
                        {/* Header row */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 0.8fr 1fr 0.9fr 1.4fr", background: "#1a1a1a", padding: "16px 24px", gap: 8 }}>
                            {["ORDER ID","CUSTOMER NAME","DATE","ITEMS","TOTAL","STATUS","ACTIONS"].map(h => (
                                <span key={h} style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: 1.4 }}>{h}</span>
                            ))}
                        </div>

                        {items.length === 0 ? (
                            <div style={{ background: "#fff", padding: "56px", textAlign: "center", color: "#bbb", fontSize: 14 }}>
                                <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
                                No orders found.
                            </div>
                        ) : (
                            items.map((order, idx) => {
                                const s = STATUS_STYLES[order.status] ?? { bg: "#f5f5f5", color: "#555" };
                                const itemCount = order.items_count ?? order.items?.length ?? 0;
                                const dateStr = new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                                return (
                                    <div key={order.id} style={{
                                        display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 0.8fr 1fr 0.9fr 1.4fr",
                                        padding: "16px 24px", gap: 8, alignItems: "center",
                                        background: idx % 2 === 0 ? "#fff" : "#faf9f7",
                                        borderBottom: "1px solid #f0ece6",
                                    }}>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>{order.order_number}</span>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{order.user?.name ?? "—"}</span>
                                        <span style={{ fontSize: 12, color: "#6b6056" }}>{dateStr}</span>
                                        <span style={{ fontSize: 12, color: "#6b6056" }}>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{fmt(order.total_amount)}</span>
                                        <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: s.bg, color: s.color, display: "inline-flex", alignItems: "center", whiteSpace: "nowrap", width: "fit-content" }}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                        {/* Actions */}
                                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                            <button onClick={() => openView(order)} style={{
                                                background: "#f5f0e8", color: "#7a5c3a", border: "none", borderRadius: 7,
                                                padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: F.sans,
                                            }}>
                                                View
                                            </button>
                                            <button onClick={() => setDeleteTarget(order)} style={{
                                                background: "#fff0f0", color: "#c62828", border: "none", borderRadius: 7,
                                                padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: F.sans,
                                            }}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Pagination */}
                    <Pagination links={links} currPage={currPage} lastPage={lastPage} goPage={goPage} />
                </div>

                {/* Order Detail Modal */}
                {viewing && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                        <div style={{ background: "#fff", padding: "36px 40px", width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>Order Details</h2>
                                <button onClick={() => setViewing(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#aaa" }}>✕</button>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                                <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>{viewing.order_number}</p>
                                {(() => { const s = STATUS_STYLES[viewing.status] ?? {}; return (
                                    <span style={{ padding: "5px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>
                                        {viewing.status.charAt(0).toUpperCase() + viewing.status.slice(1)}
                                    </span>
                                ); })()}
                            </div>
                            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#9e9e9e" }}>
                                Placed on {new Date(viewing.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                            </p>

                            <Section title="Customer Information">
                                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f5d0a9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👤</div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{viewing.user?.name ?? "—"}</p>
                                        <p style={{ margin: 0, fontSize: 12, color: "#9e9e9e" }}>✉ {viewing.user?.email ?? "—"}</p>
                                    </div>
                                </div>
                            </Section>

                            <Section title="Order Items">
                                {(viewing.items ?? []).map(item => (
                                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                                        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                                            <span style={{ fontSize: 20 }}>📦</span>
                                            <div>
                                                <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{item.product_name}</p>
                                                <p style={{ margin: 0, fontSize: 11, color: "#9e9e9e" }}>Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{fmt(item.subtotal)}</p>
                                            <p style={{ margin: 0, fontSize: 11, color: "#9e9e9e" }}>{fmt(item.unit_price)} each</p>
                                        </div>
                                    </div>
                                ))}
                                <div style={{ borderTop: "1px solid #f0ece6", marginTop: 12, paddingTop: 14 }}>
                                    <Row label="Subtotal" value={fmt(viewing.subtotal)} />
                                    <Row label="Shipping" value={fmt(viewing.shipping_fee)} />
                                    <Row label="Tax"      value={fmt(0)} />
                                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                                        <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>TOTAL</span>
                                        <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>{fmt(viewing.total_amount)}</span>
                                    </div>
                                </div>
                            </Section>

                            <Section title="Update Order Status">
                                <select value={newStatus} onChange={e => setNewStatus(e.target.value)} style={{
                                    width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0dbd3",
                                    fontSize: 13, fontFamily: F.sans, outline: "none", marginBottom: 16,
                                    background: "#fff", cursor: "pointer",
                                }}>
                                    {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                </select>

                                <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>Order Timeline</p>
                                {TIMELINE.map(t => (
                                    <div key={t.key} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: t.color, marginTop: 2, flexShrink: 0 }} />
                                        <div>
                                            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{t.label}</p>
                                            <p style={{ margin: 0, fontSize: 11, color: "#9e9e9e" }}>{t.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </Section>

                            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                                <button onClick={() => setViewing(null)} style={{ flex: 1, padding: "13px", border: "1.5px solid #e0dbd3", borderRadius: 10, background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: F.sans }}>
                                    Close
                                </button>
                                <button onClick={handleUpdateStatus} style={{ flex: 1, padding: "13px", border: "none", borderRadius: 10, background: "#1a1a1a", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: F.sans }}>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteTarget && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
                        <div style={{ background: "#fff", borderRadius: 20, padding: "36px 40px", width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
                            <div style={{ textAlign: "center", marginBottom: 24 }}>
                                <div style={{ fontSize: 44, marginBottom: 12 }}>🗑️</div>
                                <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>Delete Order?</h2>
                                <p style={{ margin: 0, fontSize: 13, color: "#00000" }}>
                                    Are you sure you want to delete <strong>{deleteTarget.order_number}</strong>? This action cannot be undone.
                                </p>
                            </div>
                            <div style={{ display: "flex", gap: 12 }}>
                                <button onClick={() => setDeleteTarget(null)} style={{ flex: 1, padding: "13px", border: "1.5px solid #e0dbd3", borderRadius: 10, background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: F.sans }}>
                                    Cancel
                                </button>
                                <button onClick={handleDelete} style={{ flex: 1, padding: "13px", border: "none", borderRadius: 10, background: "#c62828", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: F.sans }}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AdminLayout>
        </>
    );
}

function Section({ title, children }) {
    return (
        <div style={{ border: "1px solid #f0ece6", borderRadius: 14, padding: "20px 22px", marginBottom: 16 }}>
            <p style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{title}</p>
            {children}
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: "#6b6056" }}>{label}</span>
            <span style={{ fontSize: 13, color: "#1a1a1a" }}>{value}</span>
        </div>
    );
}

function DropItem({ label, onClick, active }) {
    return (
        <div onClick={onClick} style={{ padding: "12px 18px", fontSize: 13, cursor: "pointer", fontWeight: active ? 600 : 400, background: active ? "#f5f0e8" : "#fff", color: "#1a1a1a" }}>
            {label}
        </div>
    );
}

function Pagination({ links, currPage, lastPage, goPage }) {
    if (!links || links.length === 0) return null;

    const prevUrl  = links[0]?.url;
    const nextUrl  = links[links.length - 1]?.url;
    const pageLinks = links.slice(1, -1);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 8 }}>
            {/* Previous */}
            <button
                onClick={() => goPage(prevUrl)}
                disabled={!prevUrl}
                style={{
                    padding: "10px 18px", borderRadius: 8, border: "none",
                    background: !prevUrl ? "rgba(255,255,255,0.35)" : "#e85252",
                    color: !prevUrl ? "rgba(255,255,255,0.55)" : "#fff",
                    fontWeight: 700, fontSize: 13, cursor: !prevUrl ? "default" : "pointer",
                    fontFamily: F.sans, boxShadow: !prevUrl ? "none" : "0 2px 8px rgba(0,0,0,0.1)",
                }}
            >
                « Previous
            </button>

            {/* Page numbers */}
            {pageLinks.map((l, i) => (
                <button
                    key={i}
                    onClick={() => goPage(l.url)}
                    disabled={!l.url}
                    style={{
                        width: 40, height: 40, borderRadius: 8, border: "none",
                        background: l.active ? "#1a1a1a" : "#e85252",
                        color: "#fff",
                        fontWeight: 700, fontSize: 14,
                        cursor: !l.url ? "default" : "pointer",
                        fontFamily: F.sans,
                        opacity: !l.url ? 0.5 : 1,
                        boxShadow: l.active ? "0 2px 8px rgba(0,0,0,0.2)" : "0 2px 8px rgba(232,82,82,0.3)",
                    }}
                >
                    {l.label}
                </button>
            ))}

            {/* Next */}
            <button
                onClick={() => goPage(nextUrl)}
                disabled={!nextUrl}
                style={{
                    padding: "10px 18px", borderRadius: 8, border: "none",
                    background: !nextUrl ? "rgba(255,255,255,0.35)" : "#e85252",
                    color:!nextUrl ? "rgba(255,255,255,0.55)" : "#fff",
                    fontWeight: 700, fontSize: 13, cursor: !nextUrl ? "default" : "pointer",
                    fontFamily: F.sans, boxShadow: !nextUrl ? "none" : "0 2px 8px rgba(232,82,82,0.3)",
                }}
            >
                Next »
            </button>
        </div>
    );
}
