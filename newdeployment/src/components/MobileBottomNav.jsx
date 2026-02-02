import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SearchOverlay from './SearchOverlay';

export default function MobileBottomNav() {
    const { user, userData } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // State for Search Overlay
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Role handling with fallback
    const role = userData?.role || 'buyer';

    // Don't show on auth pages or welcome page
    const hideOnRoutes = ['/login', '/signup', '/register', '/welcome'];
    if (hideOnRoutes.some(path => location.pathname.startsWith(path)) || (location.pathname === '/' && !user)) {
        return null;
    }

    const handleProfileClick = (e) => {
        e.preventDefault();
        console.log("MobileNav: Profile clicked. User:", !!user, "Role:", role);

        if (!user) {
            navigate('/login');
        } else if (role === 'seller' || role === 'farmer') {
            navigate('/seller-dashboard');
        } else {
            navigate('/buyer-dashboard');
        }
    };

    return (
        <>
            {/* FIXED BOTTOM BAR */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 lg:hidden z-[90] px-6 py-3 pb-safe-area-inset-bottom shadow-lg">
                <div className="grid grid-cols-3 items-center max-w-lg mx-auto">
                    <Link to="/home" className="flex flex-col items-center gap-1 group">
                        <div className={`p-1.5 rounded-lg transition-all ${location.pathname === '/home' || location.pathname === '/' || location.pathname === '/marketplace' ? 'text-farm-deep bg-farm-earth' : 'text-slate-400 group-hover:text-farm-deep'}`}>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                        </div>
                        <span className={`text-[8px] font-black uppercase tracking-widest ${location.pathname === '/home' || location.pathname === '/' || location.pathname === '/marketplace' ? 'text-farm-deep' : 'text-slate-400'}`}>Mandi</span>
                    </Link>

                    <button onClick={() => setIsSearchOpen(true)} className="flex flex-col items-center gap-1 group">
                        <div className={`p-1.5 rounded-lg transition-all ${isSearchOpen ? 'text-farm-deep bg-farm-earth' : 'text-slate-400 group-hover:text-farm-deep'}`}>
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <span className={`text-[8px] font-black uppercase tracking-widest ${isSearchOpen ? 'text-farm-deep' : 'text-slate-400'}`}>Search</span>
                    </button>

                    <button onClick={handleProfileClick} className="flex flex-col items-center gap-1 group">
                        <div className={`p-1.5 rounded-lg transition-all ${location.pathname.includes('dashboard') || location.pathname === '/profile' ? 'text-farm-deep bg-farm-earth' : 'text-slate-400 group-hover:text-farm-deep'}`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <span className={`text-[8px] font-black uppercase tracking-widest ${location.pathname.includes('dashboard') || location.pathname === '/profile' ? 'text-farm-deep' : 'text-slate-400 group-hover:text-farm-deep'}`}>Profile</span>
                    </button>
                </div>
            </div>

            {/* DEDICATED SEARCH OVERLAY */}
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
