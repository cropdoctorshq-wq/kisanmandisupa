import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [status, setStatus] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setStatus("");
        setLoading(true);

        try {
            console.log("Login: Starting login for", email);
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            const user = data.user;
            console.log("Login: Auth success for", user.id);

            // 1. Try metadata first for speed
            let role = user.user_metadata?.role;
            console.log("Login: Metadata role:", role);

            // 2. Fallback to DB if metadata is missing (legacy accounts)
            if (!role) {
                console.log("Login: Metadata role missing, checking DB...");
                setStatus("Finalizing login...");
                const { data: dbUser, error: dbError } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (!dbError && dbUser) {
                    role = dbUser.role;
                    console.log("Login: DB role found:", role);
                }
            }

            // 3. Route based on role
            if (role === 'seller' || role === 'farmer') {
                console.log("Login: Routing to Seller Dashboard");
                navigate('/seller-dashboard');
            } else if (role === 'buyer') {
                console.log("Login: Routing to Buyer Dashboard");
                navigate('/buyer-dashboard');
            } else {
                console.log("Login: Role unclear, routing to Home");
                navigate('/home');
            }
        } catch (err) {
            console.error("Login: Process failed", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        if (!email) {
            setError("Please enter your email address first.");
            return;
        }
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) throw error;
            setStatus("Password reset link sent to your email!");
            setError("");
        } catch (err) {
            setError(err.message);
            setStatus("");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 lg:p-12 relative overflow-hidden bg-[#F8F9FA] font-['Plus_Jakarta_Sans']" style={{ backgroundImage: 'radial-gradient(#E9ECEF 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-200/40 rounded-full blur-[100px] mix-blend-multiply animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-200/40 rounded-full blur-[100px] mix-blend-multiply animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] overflow-hidden w-full max-w-5xl flex flex-col lg:flex-row min-h-[600px] relative z-10 transition-all duration-500 shadow-xl border border-white/60 animate-fade-up">

                {/* Left Section: Form */}
                <div className="w-full lg:w-1/2 p-6 lg:p-16 flex flex-col justify-center relative z-20 bg-white/50">

                    {/* Header: Back & Logo */}
                    <div className="flex items-center justify-between mb-8 lg:mb-12">
                        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-green-700 font-bold transition-all group text-xs uppercase tracking-widest hover:pl-1">
                            <span className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center group-hover:bg-green-50 group-hover:border-green-200 transition-colors shadow-sm">←</span>
                            Back to Home
                        </Link>
                        <Link to="/" className="block group">
                            <img src="/assets/kisanmandi.in logo.png" alt="Logo" className="h-8 lg:h-12 object-contain group-hover:scale-105 transition-transform drop-shadow-sm" />
                        </Link>
                    </div>

                    <div className="mb-6 md:mb-10 text-center">
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-500 font-medium">Enter your details to access your account</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@kisan.com"
                                autoComplete="username"
                                className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:bg-white focus:ring-4 focus:ring-[#12a44f]/20 focus:border-[#12a44f] outline-none transition-all duration-200 font-medium shadow-sm text-base"
                            />
                        </div>
                        <div className="relative">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:bg-white focus:ring-4 focus:ring-[#12a44f]/20 focus:border-[#12a44f] outline-none transition-all duration-200 font-medium shadow-sm text-base pr-12"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors">
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L4.5 4.5m15 15l-5.38-5.38m1.38-1.38l1.38 1.38a9.97 9.97 0 001.562-3.029c-1.274-4.057-5.064-7-9.542-7-1.274 0-2.483.225-3.596.632l1.638 1.638" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="button" onClick={handleReset} className="text-xs font-bold text-[#12a44f] hover:underline focus:outline-none">
                                Forgot Password?
                            </button>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 flex items-center gap-2 animate-shake">
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {status && (
                            <div className="bg-green-50 text-green-700 text-sm p-4 rounded-xl border border-green-100 flex items-center gap-2">
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{status}</span>
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="w-full bg-[#12a44f] hover:bg-[#0e8a40] text-white text-lg font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#12a44f]/20 mt-2 transform hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:pointer-events-none">
                            {loading ? (status || "Verifying...") : "Log In"}
                        </button>

                        <div className="text-center mt-6">
                            <p className="text-gray-500 font-medium">Don't have an account? <Link to="/" className="text-[#12a44f] font-bold hover:underline">Sign Up</Link></p>
                        </div>
                    </form>
                </div>

                {/* Right Section: Image */}
                <div className="w-full lg:w-1/2 bg-[#F0FDF4] relative overflow-hidden flex items-center justify-center p-12 hidden lg:flex group">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-green-100/50 to-transparent"></div>

                    <img src="/assets/login.png" alt="Welcome Login" className="relative z-10 w-full max-w-sm object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105 group-hover:rotate-2" />

                    {/* Graphic Element */}
                    <div className="absolute top-10 right-10 w-24 h-24 bg-white/30 backdrop-blur-md rounded-2xl rotate-12 animate-bounce border border-white/40 delay-100"></div>
                </div>
            </div>
        </div>
    );
}
