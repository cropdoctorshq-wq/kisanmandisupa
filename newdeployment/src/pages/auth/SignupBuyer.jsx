import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

export default function SignupBuyer() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [status, setStatus] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        terms: false
    });

    // Password strength logic
    const [passwordStrength, setPasswordStrength] = useState(0);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        setFormData(prev => ({ ...prev, [id]: val }));

        if (id === 'password') {
            calculateStrength(val);
        }
    };

    const calculateStrength = (val) => {
        let score = 0;
        if (val.length > 5) score++;
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]|[^A-Za-z0-9]/.test(val)) score++;
        setPasswordStrength(score);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setStatus("Creating Account...");
        console.log("Starting buyer signup process...");

        // Safety timeout for the entire process
        const submissionTimeout = setTimeout(() => {
            if (loading) {
                console.warn("Signup: Submission is taking longer than expected...");
                setStatus("Still working... please wait or check your connection.");
            }
        }, 10000);

        try {
            // 1. Create Auth
            console.log("Attempting to sign up with email:", formData.email);
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.name,
                        phone: formData.phone,
                        role: 'buyer'
                    }
                }
            });

            if (authError) {
                console.error("Supabase Auth Error:", authError);
                if (authError.message.includes("rate limit")) {
                    throw new Error("Too many requests. Please try again in an hour.");
                }
                throw authError;
            }

            const user = authData.user;
            const session = authData.session;
            console.log("Auth successful. User ID:", user?.id, "Session present:", !!session);

            if (!user) {
                throw new Error("Signup reported success but no user was returned.");
            }

            // Handle Email Confirmation Case
            if (!session) {
                console.log("Signup: No session returned. Likely email confirmation required.");
                setStatus("Account created! Please check your email to confirm your account.");
                alert("Account created! Please check your email to verify your account before logging in.");
                setLoading(false);
                clearTimeout(submissionTimeout);
                return; // Stop here as we can't write to DB without session (RLS)
            }

            setStatus("Saving Profile...");

            // 2. Save DB
            const userData = {
                id: user.id,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                role: 'buyer',
                created_at: new Date().toISOString()
            };

            console.log("Attempting to save user data to 'users' table:", userData);

            const { error: dbError } = await supabase
                .from('users')
                .upsert([userData]);

            if (dbError) {
                console.error("Supabase DB Error:", dbError);
                // If RLS fails because of session lag, we can try to wait a bit or throw
                throw dbError;
            }

            console.log("User data saved successfully.");
            setStatus("Success! Redirecting...");

            clearTimeout(submissionTimeout);

            // Short delay to ensure state propagates
            setTimeout(() => {
                console.log("Redirecting to home...");
                navigate('/home');
            }, 1000);

        } catch (err) {
            console.error("Signup Process Failed:", err);
            if (err.message && err.message.includes("duplicate key")) {
                setError("This email is already registered. Please log in.");
            } else {
                setError(err.message || "An unexpected error occurred.");
            }
            setStatus("");
        } finally {
            setLoading(false);
            clearTimeout(submissionTimeout);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-3 lg:p-6 bg-[#F8F9FA] font-['Poppins']" style={{ backgroundImage: 'radial-gradient(#E9ECEF 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            {/* Main Card Container - Fixed Height on Desktop */}
            <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] lg:rounded-[2.5rem] shadow-xl shadow-orange-900/5 overflow-hidden w-full max-w-6xl flex flex-col lg:flex-row min-h-[600px] lg:h-[85vh] lg:max-h-[800px] border border-white/50 relative animate-fade-up">

                {/* Left Section: Form - Scrollable on Desktop */}
                <div className="w-full lg:w-1/2 p-6 lg:p-12 flex flex-col justify-start relative z-10 order-2 lg:order-1 lg:overflow-y-auto hide-scrollbar lg:py-16">

                    <div className="flex items-center justify-between mb-6 lg:mb-8">
                        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-700 font-bold transition-all group text-[10px] lg:text-xs uppercase tracking-widest hover:pl-1">
                            <span className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center group-hover:bg-orange-50 group-hover:border-orange-200 transition-colors shadow-sm">←</span>
                            Back to Home
                        </Link>
                        <Link to="/" className="block group">
                            <img src="/assets/kisanmandi.in logo.png" alt="Logo" className="h-6 lg:h-8 object-contain group-hover:scale-105 transition-transform drop-shadow-sm" />
                        </Link>
                    </div>

                    <div className="mb-6 lg:mb-8">
                        <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-2 tracking-tight">Become a Buyer</h2>
                        <p className="text-gray-500 font-medium text-sm lg:text-base">Source fresh produce directly from farmers.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
                        <div>
                            <label className="block text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                            <input type="text" id="name" required placeholder="Anjali Sharma" value={formData.name} onChange={handleChange} className="w-full px-5 py-3.5 lg:py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-400 outline-none transition-all duration-200 font-bold text-gray-800 shadow-sm hover:border-orange-300 text-sm" />
                        </div>
                        <div>
                            <label className="block text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                            <input type="email" id="email" required placeholder="anjali@example.com" value={formData.email} onChange={handleChange} className="w-full px-5 py-3.5 lg:py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-400 outline-none transition-all duration-200 font-bold text-gray-800 shadow-sm hover:border-orange-300 text-sm" />
                        </div>
                        <div>
                            <label className="block text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                            <input type="tel" id="phone" required placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} className="w-full px-5 py-3.5 lg:py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-400 outline-none transition-all duration-200 font-bold text-gray-800 shadow-sm hover:border-orange-300 text-sm" />
                        </div>
                        <div>
                            <label className="block text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} id="password" required placeholder="••••••••" value={formData.password} onChange={handleChange} className="w-full px-5 py-3.5 lg:py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-400 outline-none transition-all duration-200 font-bold text-gray-800 shadow-sm hover:border-orange-300 mb-2 pr-12 text-sm" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-[calc(50%+4px)] text-gray-400 hover:text-gray-600 focus:outline-none transition-colors text-[10px] lg:text-xs font-bold uppercase">
                                    {showPassword ? "hide" : "show"}
                                </button>
                            </div>
                            {/* Strength Bars - Simplified for React */}
                            <div className="flex gap-1.5 h-1.5 mb-2 px-1">
                                {[1, 2, 3, 4].map(i => {
                                    let color = 'bg-gray-100';
                                    if (i <= passwordStrength) {
                                        if (passwordStrength <= 2) color = 'bg-red-500';
                                        else if (passwordStrength === 3) color = 'bg-yellow-400';
                                        else color = 'bg-green-500';
                                    }
                                    return <div key={i} className={`flex-1 rounded-full transition-colors duration-300 ${color}`}></div>;
                                })}
                            </div>
                            <div className="text-[10px] font-bold text-gray-300 text-right pr-1">
                                {passwordStrength === 0 && "Enter Password"}
                                {passwordStrength > 0 && passwordStrength <= 2 && <span className="text-red-500">Weak Password</span>}
                                {passwordStrength === 3 && <span className="text-yellow-500">Medium Strength</span>}
                                {passwordStrength === 4 && <span className="text-green-600">Strong Password</span>}
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3 mt-4 lg:mt-6 pt-2">
                            <div className="flex items-center h-5">
                                <input id="terms" type="checkbox" required checked={formData.terms} onChange={handleChange} className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600 bg-gray-50 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 transition-all cursor-pointer" />
                            </div>
                            <label htmlFor="terms" className="ms-1 text-xs lg:text-sm font-medium text-gray-500">I agree to the <a href="#" className="text-orange-700 font-bold hover:underline">Terms & Conditions</a></label>
                        </div>

                        {status && <div className={`p-4 rounded-xl text-sm font-bold text-center border animate-pulse ${error ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>{status || error}</div>}
                        {error && <div className="p-4 rounded-xl text-sm font-bold text-center border bg-red-50 text-red-700 border-red-200">{error}</div>}

                        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold py-3.5 lg:py-4 rounded-2xl transition-all shadow-xl shadow-orange-900/20 hover:shadow-orange-900/30 mt-4 lg:mt-6 transform hover:-translate-y-1 active:scale-95 text-base lg:text-lg disabled:opacity-70">
                            {loading ? "Creating Account..." : "Create Buyer Account"}
                        </button>
                    </form>

                    <p className="text-center mt-6 lg:mt-8 text-xs lg:text-sm text-gray-500 font-bold">
                        Already have an account? <Link to="/login" className="text-orange-700 hover:text-orange-800 hover:underline">Log in</Link>
                    </p>
                </div>

                {/* Right Section: Image - Fixed on desktop */}
                <div className="w-full lg:w-1/2 bg-orange-50 relative order-1 lg:order-2 overflow-hidden flex items-center justify-center h-80 lg:h-full min-h-[300px] lg:min-h-full">
                    <img
                        src="/assets/signup_buyer_hero.png?v=2"
                        alt="Happy Buyer"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden"></div>
                </div>
            </div>
        </div>
    );
}
