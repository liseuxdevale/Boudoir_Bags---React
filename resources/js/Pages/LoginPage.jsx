// FILE: resources/js/Pages/LoginPage.jsx

import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import Footer from "../components/Footer";

const C = {
    sand: "#c8a96e", pageBg: "#c4a882", pageBg2: "#b8967a",
    dark: "#1a1a1a", white: "#ffffff", coral: "#e8635a",
    muted: "#6b6056", pink: "#e8b4b8", pinkLight: "#f5d5d8",
    adminBtn: "#b08080",
};
const F = { display: "'Playfair Display', serif", sans: "'Montserrat', sans-serif" };

const NAV_LINKS = [
    { label: "Home",     href: "/" },
    { label: "Shop",     href: "/shop" },
    { label: "Deals",    href: "/shop" },
    { label: "About Us", href: "#" },
    { label: "Contact",  href: "#" },
];

export default function LoginPage() {
    // Inertia passes validation errors automatically via props
    const { errors: serverErrors = {} } = usePage().props;

    const [email,    setEmail]    = useState("");
    const [password, setPassword] = useState("");
    const [errors,   setErrors]   = useState({});

    const validate = () => {
        const e = {};
        if (!email.trim())    e.email    = "Email is required";
        if (!password.trim()) e.password = "Password is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleLogin = () => {
        if (!validate()) return;
        // POST to Laravel LoginController@store
        router.post("/login", { email, password });
    };

    // Quick-fill for demo/admin login — still goes through the real login route
    const handleAdminLogin = () => {
        router.post("/login", {
            email: "admin@boudoir.com",
            password: "password",
        });
    };

    // Merge client-side and server-side errors
    const allErrors = { ...errors, ...serverErrors };

    return (
        <>
            <Head title="Login" />

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
                        {/* Header */}
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
                            <h1 style={{ fontFamily: F.display, fontSize: 30, fontWeight: 700, color: C.dark, margin: "0 0 8px" }}>
                                Welcome Back!
                            </h1>
                            <p style={{ margin: 0, fontSize: 13, color: C.muted }}>
                                Log in to your account to continue
                            </p>
                        </div>

                        {/* Global server error (e.g. wrong credentials) */}
                        {serverErrors.email && !errors.email && (
                            <div style={{
                                background: "#fff0f0", border: `1px solid ${C.coral}`,
                                borderRadius: 8, padding: "10px 14px", marginBottom: 16,
                                fontSize: 13, color: C.coral,
                            }}>
                                {serverErrors.email}
                            </div>
                        )}

                        <FormField label="Email" error={allErrors.email}>
                            <input
                                type="email" value={email}
                                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
                                style={inputStyle(!!allErrors.email)}
                            />
                        </FormField>

                        <FormField label="Password" error={allErrors.password}>
                            <input
                                type="password" value={password}
                                onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: "" })); }}
                                style={inputStyle(!!allErrors.password)}
                            />
                        </FormField>

                        <div style={{ marginBottom: 24 }}>
                            <a href="#" style={{ fontSize: 12, fontWeight: 700, color: C.dark, textDecoration: "none" }}>
                                Forgot Password?
                            </a>
                        </div>

                        <button onClick={handleLogin} style={{ ...darkBtn, width: "100%", marginBottom: 12 }}>
                            Log In
                        </button>

                        <button style={{
                            width: "100%", padding: "12px", borderRadius: 10,
                            border: "1px solid #e0dbd3", background: "#f5f2ee", fontSize: 13,
                            fontWeight: 500, cursor: "pointer", fontFamily: F.sans, marginBottom: 20,
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: C.dark,
                        }}>
                            <svg width="18" height="18" viewBox="0 0 18 18">
                                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                                <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                            </svg>
                            Sign In with Google
                        </button>

                        <p style={{ textAlign: "center", margin: 0, fontSize: 13, color: C.muted }}>
                            Don't have an account?{" "}
                            <Link href="/register" style={{ color: C.coral, fontWeight: 600, textDecoration: "none" }}>
                                Sign Up
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
