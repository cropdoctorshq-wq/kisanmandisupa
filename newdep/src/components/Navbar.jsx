import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar({ onSearch }) {
    const { userData, user } = useAuth();

    // PWA & OS State
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isIOS, setIsIOS] = useState(false);
    // Initialize immediately to prevent flash
    const [isStandalone, setIsStandalone] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
        }
        return false;
    });
    const navigate = useNavigate();

    useEffect(() => {
        // Installation status check
        const checkStandalone = () => {
            const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
            setIsStandalone(isStandaloneMode);
            console.log("Navbar: Standalone Mode:", isStandaloneMode);
        };
        checkStandalone();

        // Browser OS detection
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIPhone = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIPhone);

        // Capture Android beforeinstallprompt
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            console.log("Navbar: Android Install Prompt Ready");
        };
        window.addEventListener('beforeinstallprompt', handler);

        // AUTO-PROMPT LOGIC FOR ANDROID: 
        // Trigger the native prompt on the FIRST user click anywhere on the page
        const triggerAutoPrompt = () => {
            // Check again if we're standalone to be doubly sure
            const isInstalled = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
            if (deferredPrompt && !isInstalled) {
                console.log("Navbar: Auto-triggering native Android prompt...");
                deferredPrompt.prompt();
                setDeferredPrompt(null);
                window.removeEventListener('click', triggerAutoPrompt);
            }
        };

        if (!isIPhone) {
            window.addEventListener('click', triggerAutoPrompt);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            window.removeEventListener('click', triggerAutoPrompt);
        };
    }, [deferredPrompt, isStandalone]);

    // Handle Manual Install Click (Fallback or Backup)
    const handleInstallClick = async (e) => {
        e.stopPropagation(); // Prevent triggerAutoPrompt from double firing if clicked
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        } else {
            // If no native prompt (Android) then show the dedicated guide
            navigate('/install-guide');
        }
    };

    return (
        <nav className="glass-header sticky top-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-lg shadow-sm border-b border-slate-100/50">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-20 gap-4">

                    {/* Logo */}
                    <Link to="/home" className="flex-shrink-0 flex items-center gap-3 cursor-pointer group">
                        <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-100 group-hover:rotate-3 transition-transform">
                            <img className="h-10 w-auto md:h-12 object-contain" src="/assets/kisanmandi.in logo.png" alt="Kisan Mandi Logo" />
                        </div>
                    </Link>

                    {/* Desktop Search */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-8 relative group">
                        <input
                            type="text"
                            autoComplete="off"
                            autoCorrect="off"
                            onChange={(e) => onSearch && onSearch(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200/80 rounded-full py-3.5 pl-12 pr-4 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#15803d]/50 focus:border-[#15803d] focus:bg-white transition-all shadow-sm group-hover:shadow-md font-sans"
                            placeholder="Search fresh harvest..."
                        />
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-[#15803d] opacity-50 group-focus-within:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:gap-4">

                        {/* Install App Button (Visible only if not installed) */}
                        {!isStandalone && (
                            <button
                                onClick={handleInstallClick}
                                className="flex items-center gap-2 text-[10px] md:text-sm font-bold text-white bg-[#15803d] hover:bg-[#14532D] px-3 md:px-5 py-2 md:py-2.5 rounded-2xl transition-all shadow-lg shadow-green-900/10 active:scale-95 whitespace-nowrap"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                <span>Install App</span>
                            </button>
                        )}

                        {(!userData || (userData.role !== 'seller' && userData.role !== 'farmer')) && (
                            <Link to="/signup-farmer" className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-[#15803d] px-2 py-1 transition-all">
                                <span>Sale Harvest</span>
                            </Link>
                        )}

                        <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

                        {/* Profile Link */}
                        <Link
                            to={userData ? ((userData.role === 'seller' || userData.role === 'farmer') ? '/seller-dashboard' : '/buyer-dashboard') : '/login'}
                            className="flex items-center gap-2 md:gap-3 p-1.5 hover:bg-slate-100 rounded-2xl transition-all duration-300 cursor-pointer group shrink-0"
                        >
                            <div className="w-8 h-8 md:w-10 md:h-10 relative shrink-0">
                                <img
                                    src={userData?.profileImage || (userData?.role === 'seller' ? "/assets/farmer_avatar_new.png" : "/assets/buyer.png")}
                                    className="w-full h-full rounded-xl border border-white shadow-md object-cover ring-2 ring-white"
                                    alt="User"
                                />
                                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 md:w-3 md:h-3 border-2 border-white rounded-full ${userData ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                            </div>
                            <div className="hidden md:block text-left pr-1">
                                <p className="text-[11px] font-black text-slate-800 leading-tight">
                                    {(userData?.name ? userData.name.split(' ')[0] : "Guest")}
                                </p>
                                <p className="text-[9px] font-bold text-green-600 uppercase tracking-wider">
                                    {userData ? "Dashboard" : "Login Now"}
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>


        </nav>
    );
}
