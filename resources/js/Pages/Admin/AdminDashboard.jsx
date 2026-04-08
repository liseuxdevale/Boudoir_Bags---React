import { Head } from "@inertiajs/react";
import {
    Bar, BarChart, CartesianGrid, Cell, Legend,
    Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import AdminLayout from "./AdminLayout";

const F = { display: "'Playfair Display', serif", sans: "'Montserrat', sans-serif" };
const PIE_COLORS = ["#4FC3F7","#81C784","#FFB74D","#E57373","#BA68C8","#64B5F6","#F06292","#4DB6AC"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fmt = (n) => `₱${Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

// Custom tooltip for bar chart
function SalesTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: "#fff", border: "1px solid #f0ece6", borderRadius: 10, padding: "10px 16px", fontSize: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.10)" }}>
            <p style={{ margin: "0 0 6px", fontWeight: 700, color: "#1a1a1a" }}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ margin: "2px 0", color: p.color }}>
                    {p.name === "Revenue" ? fmt(p.value) : `${p.value} orders`}
                </p>
            ))}
        </div>
    );
}

// Custom tooltip for pie chart
function PieTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: "#fff", border: "1px solid #f0ece6", borderRadius: 10, padding: "8px 14px", fontSize: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.10)" }}>
            <p style={{ margin: 0, fontWeight: 700, color: "#1a1a1a" }}>{payload[0].name}</p>
            <p style={{ margin: "2px 0 0", color: "#6b6056" }}>{payload[0].value} product{payload[0].value !== 1 ? "s" : ""}</p>
        </div>
    );
}

export default function AdminDashboard({
    stats = {}, recentOrders = [], salesData = [], lowStock = [], productsByCategory = {}
}) {
    const { totalRevenue = 0, totalOrders = 0, totalProducts = 0, totalCustomers = 0 } = stats;

    // Build bar chart data — fill all 6 months even if no sales
    const now = new Date();
    const last6 = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
        return { month: MONTHS[d.getMonth()], monthNum: d.getMonth() + 1, year: d.getFullYear(), revenue: 0, orders: 0 };
    });
    salesData.forEach(d => {
        const entry = last6.find(e => e.monthNum === d.month && e.year === d.year);
        if (entry) { entry.revenue = Number(d.revenue) || 0; entry.orders = Number(d.orders) || 0; }
    });

    // Build pie data from productsByCategory
    const pieData = Object.entries(productsByCategory).map(([name, value]) => ({ name, value }));

    return (
        <>
            <Head title="Admin Dashboard" />
            <AdminLayout activePage="dashboard">
                <div style={{
                    background: "linear-gradient(160deg, #c8a96e 0%, #c09070 45%, #b07868 100%)",
                    minHeight: "100vh", padding: "40px 44px",
                }}>
                    {/* Header */}
                    <div style={{ marginBottom: 32 }}>
                        <h1 style={{
                            fontFamily: F.display, fontWeight: 900, fontSize: 36,
                            color: "#fff", textTransform: "uppercase", letterSpacing: 4, margin: "0 0 6px",
                        }}>DASHBOARD</h1>
                        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
                            Good Day, Admin! Welcome to Boudoir Bags Admin Page
                        </p>
                    </div>

                    {/* Stat cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 28 }}>
                        <StatCard label="Total Sales"        value={fmt(totalRevenue)}    sub="All-time Revenue"          icon="₱"  iconBg="#e8f5e9" />
                        <StatCard label="Total Orders"       value={`${totalOrders}+`}    sub="Total Placed Orders"       icon="🛒" iconBg="#e3f2fd" />
                        <StatCard label="Total Customers"    value={`${totalCustomers}+`} sub="Loyal Customers"           icon="👤" iconBg="#fce4ec" />
                        <StatCard label="Low Stock Products" value={lowStock.length}       sub="Products about to run out" icon="⚠️" iconBg="#fff8e1" />
                    </div>

                    {/* Charts */}
                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20, marginBottom: 28 }}>

                        {/* Bar chart — Annual Sales */}
                        <div style={{ background: "#fff", borderRadius: 16, padding: "24px 20px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>Annual Sales</h3>
                                <span style={{ fontSize: 11, color: "#9e9e9e" }}>Last 6 months</span>
                            </div>
                            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                                <span style={{ fontSize: 11, color: "#e899c8", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                                    <span style={{ width: 10, height: 10, borderRadius: 2, background: "#e899c8", display: "inline-block" }} /> Revenue
                                </span>
                                <span style={{ fontSize: 11, color: "#b57fd4", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                                    <span style={{ width: 10, height: 10, borderRadius: 2, background: "#b57fd4", display: "inline-block" }} /> Orders
                                </span>
                            </div>
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={last6} margin={{ top: 5, right: 10, left: 10, bottom: 0 }} barGap={4}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f0e8" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#aaa" }} axisLine={false} tickLine={false} />
                                    {/* Left axis: revenue */}
                                    <YAxis
                                        yAxisId="revenue"
                                        orientation="left"
                                        tick={{ fontSize: 10, fill: "#aaa" }}
                                        axisLine={false} tickLine={false}
                                        tickFormatter={(v) => v >= 1000 ? `₱${(v/1000).toFixed(0)}k` : `₱${v}`}
                                        width={52}
                                    />
                                    {/* Right axis: orders */}
                                    <YAxis
                                        yAxisId="orders"
                                        orientation="right"
                                        tick={{ fontSize: 10, fill: "#aaa" }}
                                        axisLine={false} tickLine={false}
                                        allowDecimals={false}
                                        width={30}
                                    />
                                    <Tooltip content={<SalesTooltip />} />
                                    <Bar yAxisId="revenue" dataKey="revenue" fill="#e899c8" radius={[5,5,0,0]} name="Revenue" maxBarSize={32} />
                                    <Bar yAxisId="orders"  dataKey="orders"  fill="#b57fd4" radius={[5,5,0,0]} name="Orders"  maxBarSize={32} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Pie chart — Product Status by Category */}
                        <div style={{ background: "#fff", borderRadius: 16, padding: "24px 20px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>Product by Category</h3>
                                <span style={{ fontSize: 11, color: "#9e9e9e" }}>{totalProducts} active</span>
                            </div>
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie
                                        data={pieData.length ? pieData : [{ name: "No Data", value: 1 }]}
                                        dataKey="value" cx="50%" cy="50%"
                                        innerRadius={55} outerRadius={100} paddingAngle={3}
                                    >
                                        {(pieData.length ? pieData : [{}]).map((_, i) => (
                                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend
                                        iconType="circle" iconSize={8}
                                        wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                                    />
                                    <Tooltip content={<PieTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Low Stock Table */}
                    {lowStock.length > 0 && (
                        <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}>
                            {/* Table header */}
                            <div style={{ background: "#fce4ec", padding: "20px 28px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #f8bbd0" }}>
                                <span style={{ fontSize: 22 }}>⚠️</span>
                                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#e8635a", fontFamily: F.display }}>
                                    Low Stock Alert
                                </h3>
                                <span style={{ marginLeft: "auto", fontSize: 12, color: "#e8635a", fontWeight: 600, background: "#ffebee", padding: "4px 12px", borderRadius: 20, border: "1px solid #ffcdd2" }}>
                                    {lowStock.length} product{lowStock.length !== 1 ? "s" : ""}
                                </span>
                            </div>

                            {/* Column headers */}
                            <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1.5fr 1fr 1fr", padding: "12px 28px", background: "#fafafa", borderBottom: "1px solid #f0ece6" }}>
                                {["PRODUCT", "CATEGORY", "STOCK", "STATUS"].map(h => (
                                    <span key={h} style={{ fontSize: 10, fontWeight: 700, color: "#00000", letterSpacing: 1.2 }}>{h}</span>
                                ))}
                            </div>

                            {/* Rows */}
                            {lowStock.map((item, idx) => {
                                const stock  = item.inventory?.quantity ?? 0;
                                const img    = item.images?.[0]?.image_url ?? null;
                                const isOut  = stock === 0;
                                return (
                                    <div key={item.id} style={{
                                        display: "grid", gridTemplateColumns: "2.5fr 1.5fr 1fr 1fr",
                                        padding: "16px 28px", alignItems: "center",
                                        background: idx % 2 === 0 ? "#fff" : "#fafaf8",
                                        borderBottom: idx < lowStock.length - 1 ? "1px solid #f0ece6" : "none",
                                    }}>
                                        {/* Product */}
                                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                            {img ? (
                                                <img src={img} alt={item.name} style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                                            ) : (
                                                <div style={{ width: 48, height: 48, borderRadius: 10, background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>👜</div>
                                            )}
                                            <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{item.name}</span>
                                        </div>

                                        {/* Category */}
                                        <span style={{ fontSize: 13, color: "#6b6056" }}>
                                            {item.category?.name ?? item.category ?? "—"}
                                        </span>

                                        {/* Stock count */}
                                        <span style={{ fontSize: 13, fontWeight: 700, color: isOut ? "#e8635a" : "#f57c00" }}>
                                            {isOut ? "0" : stock}
                                        </span>

                                        {/* Status badge */}
                                        <span style={{
                                            display: "inline-flex", alignItems: "center",
                                            padding: "5px 14px", borderRadius: 20,
                                            fontSize: 11, fontWeight: 700, width: "fit-content",
                                            background: isOut ? "#ffebee" : "#fff8e1",
                                            color: isOut ? "#e8635a" : "#f57c00",
                                            border: `1px solid ${isOut ? "#ffcdd2" : "#ffe0b2"}`,
                                        }}>
                                            {isOut ? "Out of Stock" : `${stock} left`}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </AdminLayout>
        </>
    );
}

function StatCard({ label, value, sub, icon, iconBg }) {
    return (
        <div style={{ background: "#fff", borderRadius: 16, padding: "22px 24px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <p style={{ margin: 0, fontSize: 11, color: "#00000", fontWeight: 500, letterSpacing: 0.3 }}>{label}</p>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                    {icon}
                </div>
            </div>
            <p style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 700, color: "#00000", fontFamily: F.display }}>{value}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#00000" }}>{sub}</p>
        </div>
    );
}
