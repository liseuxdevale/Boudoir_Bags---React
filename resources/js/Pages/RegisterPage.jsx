// FILE: resources/js/Pages/RegisterPage.jsx

import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import Footer from "../components/Footer";

const C = {
    pageBg: "#c4a882", pageBg2: "#b8967a",
    dark: "#1a1a1a", white: "#ffffff", coral: "#e8635a",
    muted: "#6b6056", pinkLight: "#f5d5d8", green: "#4caf50",
};
const F = { display: "'Playfair Display', serif", sans: "'Montserrat', sans-serif" };

const NAV_LINKS = [
    { label: "Home",     href: "/" },
    { label: "Shop",     href: "/shop" },
    { label: "Deals",    href: "/shop" },
    { label: "About Us", href: "#" },
    { label: "Contact",  href: "#" },
];

export default function RegisterPage() {
    // Server-side validation errors from Laravel
    const { errors: serverErrors = {} } = usePage().props;

    const [form,   setForm]   = useState({ name: "", email: "", password: "", confirm: "" });
    const [agreed, setAgreed] = useState(true);
    const [errors, setErrors] = useState({});

    const set = (field, val) => {
        setForm(prev => ({ ...prev, [field]: val }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim())     e.name     = "Name is required";
        if (!form.email.trim())    e.email    = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
        if (!form.password.trim()) e.password = "Password is required";
        else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
        if (!form.confirm.trim())  e.confirm  = "Please confirm your password";
        else if (form.password !== form.confirm) e.confirm = "Passwords do not match";
        if (!agreed) e.terms = "You must agree to the terms";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSignUp = () => {
        if (!validate()) return;
        // POST to Laravel RegisterController@store
        router.post("/register", {
            name:                  form.name,
            email:                 form.email,
            password:              form.password,
            password_confirmation: form.confirm,
        });
    };

    // Merge client + server errors
    const allErrors = { ...errors, ...serverErrors };

    return (
        <>
            <Head title="Register" />

            <div style={{
                background: `linear-gradient(180deg, ${C.pageBg} 0%, ${C.pageBg2} 60%, #c09080 100%)`,
                minHeight: "100vh", fontFamily: F.sans,
            }}>
                {/* Navbar */}
                <nav style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "0 5%", height: 60, background: "transparent",
                }}>
                    <Link href="/" style={{
                        fontFamily: F.display, fontSize: 23, fontWeight: 700,
                        color: C.dark, letterSpacing: 1, textDecoration: "none",
                    }}>
                        𝔅oudoir
                    </Link>
                    <ul style={{ display: "flex", gap: 32, listStyle: "none", margin: 0, padding: 0 }}>
                        {NAV_LINKS.map(link => (
                            <li key={link.label}>
                                <Link href={link.href} style={{
                                    textDecoration: "none", color: C.white, fontSize: 12,
                                    fontWeight: 500, letterSpacing: 1, textTransform: "uppercase",
                                }}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Card */}
                <div style={{ display: "flex", justifyContent: "center", padding: "60px 20px 80px" }}>
                    <div style={{
                        background: C.white, borderRadius: 24, padding: "40px 48px 44px",
                        width: "100%", maxWidth: 460, boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                    }}>
                        {/* Logo badge */}
                        <div style={{ textAlign: "center", marginBottom: 28 }}>
                            <div style={{ textAlign: "center", marginBottom: 24 }}>
                            <div style={{
                                width: 120, height: 120, borderRadius: "50%",
                                margin: "0 auto 24px", overflow: "hidden",
                            }}>
                                <img
                                    src="/logo.png"
                                    alt="Boudoir"
                                    style={{
                                        width: "100%", height: "100%", objectFit: "cover",
                                    }}
                                />
                            </div>
                            </div>
                            <h1 style={{ fontFamily: F.display, fontSize: 30, fontWeight: 700, color: C.dark, margin: 0 }}>
                                Create Account
                            </h1>
                        </div>

                        {/* Name */}
                        <FormField label="Name" error={allErrors.name}>
                            <input value={form.name} onChange={e => set("name", e.target.value)}
                                style={inputStyle(!!allErrors.name)} />
                        </FormField>

                        {/* Email */}
                        <FormField label="Email" error={allErrors.email}>
                            <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                                style={inputStyle(!!allErrors.email)} />
                        </FormField>

                        {/* Password */}
                        <FormField label="Password" error={allErrors.password}>
                            <input type="password" value={form.password} onChange={e => set("password", e.target.value)}
                                style={inputStyle(!!allErrors.password)} />
                        </FormField>

                        {/* Confirm Password */}
                        <FormField label="Confirm Password" error={allErrors.password_confirmation ?? allErrors.confirm}>
                            <input type="password" value={form.confirm} onChange={e => set("confirm", e.target.value)}
                                style={inputStyle(!!(allErrors.password_confirmation ?? allErrors.confirm))} />
                        </FormField>

                        {/* Terms checkbox */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                            <div onClick={() => setAgreed(!agreed)} style={{
                                width: 18, height: 18, borderRadius: 4, cursor: "pointer", flexShrink: 0,
                                background: agreed ? C.green : C.white,
                                border: `2px solid ${agreed ? C.green : "#ccc"}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.2s",
                            }}>
                                {agreed && <span style={{ color: C.white, fontSize: 12, lineHeight: 1 }}>✓</span>}
                            </div>
                            <span style={{ fontSize: 12, color: C.muted }}>I agree to the terms and conditions</span>
                        </div>
                        {allErrors.terms && (
                            <p style={{ margin: "-16px 0 16px", fontSize: 11, color: C.coral }}>{allErrors.terms}</p>
                        )}

                        {/* Sign Up */}
                        <button onClick={handleSignUp} style={{ ...darkBtn, width: "100%", marginBottom: 20 }}>
                            Sign Up
                        </button>

                        {/* Sign in link */}
                        <p style={{ textAlign: "center", margin: 0, fontSize: 13, color: C.muted }}>
                            Already have an account?{" "}
                            <Link href="/login" style={{ color: C.coral, fontWeight: 600, textDecoration: "none" }}>
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}

function FormField({ label, error, children }) {
    return (
        <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, color: "#333", marginBottom: 6, fontFamily: F.sans }}>
                {label}
            </label>
            {children}
            {error && <p style={{ margin: "4px 0 0", fontSize: 11, color: C.coral }}>{error}</p>}
        </div>
    );
}

const inputStyle = (hasError) => ({
    width: "100%", padding: "12px 14px",
    border: hasError ? `1px solid ${C.coral}` : "none",
    borderRadius: 8, background: "#f0ede8",
    fontSize: 13, fontFamily: F.sans, outline: "none",
    boxSizing: "border-box", color: "#1a1a1a",
});

const darkBtn = {
    background: C.dark, color: C.white, border: "none",
    padding: "14px 24px", borderRadius: 10, fontSize: 14,
    fontWeight: 600, letterSpacing: 0.5, cursor: "pointer",
    fontFamily: F.sans,
};
