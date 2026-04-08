import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "./AdminLayout";

const F = { display: "'Playfair Display', serif", sans: "'Montserrat', sans-serif" };
const fmt = (n) => `₱${Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

const imgSrc = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
};

const EMPTY_FORM = { name: "", subtitle: "", category_id: "", price: "", quantity: "", active: true, image: null };

export default function AdminProducts({ products = {}, categories = [] }) {
    const items    = products.data ?? [];
    const links    = products.links ?? [];
    const lastPage = products.last_page ?? 1;
    const currPage = products.current_page ?? 1;

    const [search,  setSearch]  = useState("");
    const [modal,   setModal]   = useState(null);
    const [editing, setEditing] = useState(null);
    const [form,    setForm]    = useState(EMPTY_FORM);
    const [preview, setPreview] = useState(null);
    const [busy,    setBusy]    = useState(false);
    const [errors,  setErrors]  = useState({});

    const openAdd  = () => { setForm(EMPTY_FORM); setPreview(null); setEditing(null); setErrors({}); setModal("add"); };
    const openEdit = (p) => {
        setForm({
            name:        p.name        ?? "",
            subtitle:    p.subtitle    ?? "",
            category_id: p.category_id ?? "",
            price:       p.price       ?? "",
            quantity:    p.inventory?.quantity ?? 0,
            active:      p.active === 1 || p.active === true,
            image:       null,
        });
        setPreview(imgSrc(p.images?.[0]?.image_url ?? null));
        setEditing(p);
        setErrors({});
        setModal("edit");
    };
    const closeModal = () => { setModal(null); setEditing(null); setPreview(null); setErrors({}); };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm(f => ({ ...f, image: file }));
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = () => {
        setBusy(true);
        setErrors({});

        const data = new FormData();
        Object.entries(form).forEach(([k, v]) => {
            if (v === null || v === undefined) return;
            if (k === "active") { data.append(k, v ? 1 : 0); }
            else { data.append(k, v); }
        });

        const opts = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => { setBusy(false); closeModal(); },
            onError:   (e)  => { setBusy(false); setErrors(e); },
            onFinish:  () => { setBusy(false); },
        };

        if (modal === "add") {
            router.post("/admin/products", data, opts);
        } else {
            data.append("_method", "PUT");
            router.post(`/admin/products/${editing.id}`, data, opts);
        }
    };

    const handleDelete = (id) => {
        if (!confirm("Delete this product?")) return;
        router.delete(`/admin/products/${id}`, { preserveScroll: true });
    };

    const handleToggle = (p) => {
        router.put(
            `/admin/products/${p.id}`,
            {
                name:        p.name,
                subtitle:    p.subtitle    ?? "",
                price:       p.price,
                category_id: p.category_id,
                quantity:    p.inventory?.quantity ?? 0,
                sort_order:  p.sort_order  ?? 0,
                active:      p.active ? 0 : 1,
            },
            { preserveScroll: true }
        );
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        router.get("/admin/products", { search: e.target.value }, { preserveState: true, replace: true });
    };

    const goPage = (url) => { if (url) router.visit(url); };

    return (
        <>
            <Head title="Admin Products" />
            <AdminLayout activePage="products">
                <div style={{
                    background: "linear-gradient(160deg, #c8a96e 0%, #c09070 45%, #b07868 100%)",
                    minHeight: "100vh", padding: "40px 44px",
                }}>
                    {/* Header */}
                    <div style={{ marginBottom: 28 }}>
                        <h1 style={{ fontFamily: F.display, fontWeight: 900, fontSize: 32, color: "#fff", margin: "0 0 4px" }}>Products</h1>
                        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>Manage your bag collections</p>
                    </div>

                    {/* Toolbar */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, gap: 16 }}>
                        <div style={{ position: "relative", flex: 1, maxWidth: 480 }}>
                            <input
                                value={search} onChange={handleSearch}
                                placeholder="Search products"
                                style={{
                                    width: "100%", padding: "12px 44px 12px 18px", borderRadius: 30,
                                    border: "none", fontSize: 13, background: "#fff",
                                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)", outline: "none", boxSizing: "border-box",
                                }}
                            />
                            <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#aaa" }}></span>
                        </div>
                        <button onClick={openAdd} style={{
                            background: "#1a1a1a", color: "#fff", border: "none",
                            padding: "13px 30px", borderRadius: 10, fontSize: 13,
                            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                            fontFamily: F.sans,
                        }}>
                            <span style={{ fontSize: 18 }}>+</span> Add Products
                        </button>
                    </div>

                    {/* Product grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginBottom: 32 }}>
                        {items.map(p => {
                            const stock = p.inventory?.quantity ?? 0;
                            const img   = p.images?.[0]?.image_url;
                            return (
                                <div key={p.id} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
                                    {/* Image */}
                                    <div style={{ height: 420, background: "#f5f0e8", position: "relative", overflow: "hidden" }}>
                                        {img ? (
                                            <img src={imgSrc(img)} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        ) : (
                                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc", fontSize: 40 }}>👜</div>
                                        )}
                                        {!p.active && (
                                            <div style={{
                                                position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}>
                                                <span style={{ color: "#fff", fontSize: 16, fontWeight: 600, background: "rgba(0,0,0,0.5)", padding: "6px 18px", borderRadius: 8 }}>Unavailable</span>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ padding: "16px 18px" }}>
                                        {/* Name + toggle */}
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 }}>
                                            <div>
                                                <p style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>{p.name}</p>
                                                <p style={{ margin: 0, fontSize: 11, color: "#9e9e9e" }}>{p.category?.name ?? p.category ?? ""}</p>
                                            </div>
                                            <Toggle checked={p.active === 1 || p.active === true} onChange={() => handleToggle(p)} />
                                        </div>

                                        {/* Stock badge + price */}
                                        <div style={{ display: "flex", justifyContent: "flex-end", margin: "10px 0 6px" }}>
                                            {stock === 0 ? (
                                                <span style={{ background: "#e8635a", color: "#fff", fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>Out of stock</span>
                                            ) : (
                                                <span style={{ background: "#1a1a1a", color: "#fff", fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>{stock} in stock</span>
                                            )}
                                        </div>

                                        {p.price && <p style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{fmt(p.price)}</p>}

                                        <p style={{ margin: "0 0 14px", fontSize: 11, color: "#9e9e9e", lineHeight: 1.5 }}>
                                            {p.subtitle ?? "This bag is perfect for carrying daily essentials anywhere."}
                                        </p>

                                        <div style={{ display: "flex", gap: 10 }}>
                                            <button onClick={() => openEdit(p)} style={editBtn}>✏️ Edit</button>
                                            <button onClick={() => handleDelete(p.id)} style={deleteBtn}>🗑 Delete</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    <Pagination links={links} currPage={currPage} lastPage={lastPage} goPage={goPage} />
                </div>

                {/* Modal */}
                {modal && (
                    <div style={{
                        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
                        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
                    }}>
                        <div style={{
                            background: "#fff", borderRadius: 0, padding: "32px 36px",
                            width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>
                                    {modal === "add" ? "Add New Product" : "Edit Product"}
                                </h2>
                                <button onClick={closeModal} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#aaa" }}>✕</button>
                            </div>

                            {/* Image upload */}
                            <p style={labelStyle}>Product Image</p>
                            <label style={{
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                border: "2px dashed #e0dbd3", borderRadius: 12, height: 160, cursor: "pointer",
                                background: "#faf9f7", marginBottom: 18, overflow: "hidden",
                            }}>
                                {preview ? (
                                    <img src={preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <>
                                        <span style={{ fontSize: 28, marginBottom: 8, color: "#aaa" }}>↑</span>
                                        <span style={{ fontSize: 13, color: "#888" }}>Click to upload Image</span>
                                        <span style={{ fontSize: 11, color: "#bbb", marginTop: 4 }}>PNG, JPG up to 2 MB</span>
                                    </>
                                )}
                                <input type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
                            </label>

                            <ModalField label="Product Name *" error={errors.name}>
                                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Enter Product Name" style={inputStyle} />
                            </ModalField>

                            <ModalField label="Category *" error={errors.category_id}>
                                <select
                                    value={form.category_id}
                                    onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                                    style={inputStyle}
                                >
                                    <option value="">Select category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </ModalField>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                                <ModalField label="Price *" error={errors.price}>
                                    <input type="number" min="0" step="0.01" value={form.price}
                                        onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                        placeholder="0.00" style={inputStyle} />
                                </ModalField>
                                <ModalField label="Stock Quantity *" error={errors.quantity}>
                                    <input type="number" min="0" value={form.quantity}
                                        onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                                        placeholder="0" style={inputStyle} />
                                </ModalField>
                            </div>

                            <ModalField label="Description" error={errors.subtitle}>
                                <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                                    placeholder="Enter Product Description" style={inputStyle} />
                            </ModalField>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                                <div>
                                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>Available for Sale</p>
                                    <p style={{ margin: "2px 0 0", fontSize: 11, color: "#aaa" }}>Make this product visible to customers</p>
                                </div>
                                <Toggle checked={form.active} onChange={() => setForm(f => ({ ...f, active: !f.active }))} />
                            </div>

                            {Object.keys(errors).length > 0 && (
                                <div style={{ marginBottom: 16, padding: "10px 14px", background: "#fff0f0", border: "1px solid #fcc", borderRadius: 8 }}>
                                    {Object.values(errors).map((e, i) => (
                                        <p key={i} style={{ margin: "2px 0", fontSize: 12, color: "#c0392b" }}>• {e}</p>
                                    ))}
                                </div>
                            )}

                            <div style={{ display: "flex", gap: 12 }}>
                                <button onClick={closeModal} style={{ flex: 1, padding: "13px", border: "1.5px solid #e0dbd3", borderRadius: 10, background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: F.sans }}>
                                    Cancel
                                </button>
                                <button onClick={handleSubmit} disabled={busy} style={{ flex: 1, padding: "13px", border: "none", borderRadius: 10, background: "#1a1a1a", color: "#fff", fontSize: 13, fontWeight: 600, cursor: busy ? "not-allowed" : "pointer", fontFamily: F.sans, opacity: busy ? 0.7 : 1 }}>
                                    {busy ? "Saving…" : modal === "add" ? "Add Product" : "Update Product"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AdminLayout>
        </>
    );
}

function Toggle({ checked, onChange }) {
    return (
        <div onClick={onChange} style={{
            width: 44, height: 24, borderRadius: 12, cursor: "pointer", position: "relative",
            background: checked ? "#1a1a1a" : "#e0dbd3", transition: "background 0.2s",
            flexShrink: 0,
        }}>
            <div style={{
                width: 18, height: 18, borderRadius: "50%", background: "#fff",
                position: "absolute", top: 3, left: checked ? 23 : 3, transition: "left 0.2s",
            }} />
        </div>
    );
}

function Pagination({ links, currPage, lastPage, goPage }) {
    if (!links || links.length <= 3) return null;
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}>
            <button
                onClick={() => goPage(links[0]?.url)}
                disabled={currPage === 1}
                style={{
                    padding: "10px 18px", borderRadius: 8, border: "none",
                    background: currPage === 1 ? "rgba(255,255,255,0.35)" : "#fff",
                    color: currPage === 1 ? "rgba(255,255,255,0.55)" : "#6b6056",
                    fontWeight: 700, fontSize: 13, cursor: currPage === 1 ? "default" : "pointer",
                    fontFamily: F.sans, boxShadow: currPage === 1 ? "none" : "0 2px 8px rgba(0,0,0,0.1)",
                }}
            >
                « Previous
            </button>

            {links.slice(1, -1).map((l, i) => (
                <button
                    key={i}
                    onClick={() => goPage(l.url)}
                    disabled={!l.url}
                    style={{
                        width: 40, height: 40, borderRadius: 8, border: "none",
                        background: l.active ? "#1a1a1a" : "#fff",
                        color: l.active ? "#fff" : "#6b6056",
                        fontWeight: 700, fontSize: 14,
                        cursor: !l.url ? "default" : "pointer",
                        fontFamily: F.sans,
                        opacity: !l.url ? 0.5 : 1,
                        boxShadow: l.active ? "0 2px 8px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                >
                    {l.label}
                </button>
            ))}

            <button
                onClick={() => goPage(links[links.length - 1]?.url)}
                disabled={currPage === lastPage}
                style={{
                    padding: "10px 18px", borderRadius: 8, border: "none",
                    background: currPage === lastPage ? "rgba(255,255,255,0.35)" : "#fff",
                    color: currPage === lastPage ? "rgba(255,255,255,0.55)" : "#6b6056",
                    fontWeight: 700, fontSize: 13, cursor: currPage === lastPage ? "default" : "pointer",
                    fontFamily: F.sans, boxShadow: currPage === lastPage ? "none" : "0 2px 8px rgba(0,0,0,0.1)",
                }}
            >
                Next »
            </button>
        </div>
    );
}

function ModalField({ label, children, error }) {
    return (
        <div style={{ marginBottom: 16 }}>
            <p style={labelStyle}>{label}</p>
            {children}
            {error && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#e8635a" }}>{error}</p>}
        </div>
    );
}

const labelStyle = { margin: "0 0 6px", fontSize: 12, fontWeight: 500, color: "#555" };
const inputStyle = { width: "100%", padding: "10px 14px", border: "1px solid #e8e3dc", borderRadius: 8, fontSize: 13, background: "#f5f2ee", outline: "none", boxSizing: "border-box", fontFamily: "'Montserrat', sans-serif" };
const editBtn    = { display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#fff", border: "1.5px solid #1a1a1a", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Montserrat', sans-serif" };
const deleteBtn  = { display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#fff", border: "1.5px solid #e8635a", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#e8635a", cursor: "pointer", fontFamily: "'Montserrat', sans-serif" };


