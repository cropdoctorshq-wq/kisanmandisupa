import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import BuyerQueries from '../components/dashboard/BuyerQueries';
import BuyerProfile from '../components/dashboard/BuyerProfile';
import { useNavigate } from 'react-router-dom';


export default function BuyerDashboard() {
    const { user, logout, userData, loading } = useAuth();
    const navigate = useNavigate();
    const [currentSection, setCurrentSection] = useState('queries');

    useEffect(() => {
        if (!loading && !user) navigate('/');
        if (!loading && user && userData && userData.role !== 'buyer') {
            // If not buyer, maybe seller?
            if (userData.role === 'seller' || userData.role === 'farmer') navigate('/seller-dashboard');
            else navigate('/home'); // Fallback
        }
    }, [user, loading, userData, navigate]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div></div>;

    if (!userData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#F8F9FA]">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-md">
                    <div className="text-4xl mb-4">🛒</div>
                    <h2 className="text-2xl font-black text-slate-800 mb-2">Profile Not Found</h2>
                    <p className="text-slate-500 mb-6 font-medium">We couldn't load your buyer profile. Please check your internet connection or try logging in again.</p>
                    <div className="flex flex-col gap-3">
                        <button onClick={() => window.location.reload()} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg">Try Again</button>
                        <button onClick={logout} className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-bold">Sign Out</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="organic-texture bg-[#F8F9FA] min-h-screen font-sans text-slate-900" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
            <Navbar onSearch={() => { }} />

            {/* Mobile Top Tabs (Segmented Control) */}
            <div className="lg:hidden px-4 mt-4 mb-2">
                <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100 flex">
                    <button
                        onClick={() => setCurrentSection('queries')}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${currentSection === 'queries' ? 'bg-[#15803d] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Inquiries
                    </button>
                    <button
                        onClick={() => setCurrentSection('profile')}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${currentSection === 'profile' ? 'bg-[#15803d] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Profile
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8 pb-32">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Sidebar Nav (Desktop) */}
                    <aside className="hidden lg:block w-full lg:w-64 shrink-0 space-y-4">
                        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-4 sticky top-28 shadow-sm">
                            <nav className="space-y-2">
                                <button onClick={() => setCurrentSection('queries')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold ${currentSection === 'queries' ? 'bg-[#15803d]/10 text-[#15803d] shadow-sm ring-1 ring-[#15803d]/20' : 'text-slate-600 hover:bg-slate-50'}`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                    My Inquiries
                                </button>
                                <button onClick={() => setCurrentSection('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold ${currentSection === 'profile' ? 'bg-[#15803d]/10 text-[#15803d] shadow-sm ring-1 ring-[#15803d]/20' : 'text-slate-600 hover:bg-slate-50'}`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    Edit Profile
                                </button>
                                <hr className="my-2 border-slate-100" />
                                <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold rounded-xl text-red-500 hover:bg-red-50 transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                    Logout
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Dynamic Sections */}
                    <div className="flex-1 min-w-0">
                        {/* Dashboard Banner */}
                        <div className="relative rounded-3xl overflow-hidden mb-8 h-40 md:h-48 flex items-center shadow-lg shadow-[#15803d]/5 group">
                            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('/assets/hero_scene.png')" }}></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

                            <div className="relative z-10 px-8 md:px-10">
                                <span className="inline-block py-1 px-3 rounded-full bg-white/20 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest mb-3 backdrop-blur-md">Buyer Panel</span>
                                <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-2 drop-shadow-md">Find Fresh <span className="text-emerald-400">Produce</span></h1>
                                <p className="text-slate-100 text-sm md:text-base font-medium max-w-lg drop-shadow-md">Connect directly with farmers and source the best organic quality.</p>
                            </div>
                        </div>

                        {currentSection === 'queries' && <BuyerQueries />}
                        {currentSection === 'profile' && <BuyerProfile />}
                    </div>
                </div>

                {/* Mobile-only Logout Footer */}
                <div className="lg:hidden mt-12 pb-8 flex justify-center">
                    <button
                        onClick={logout}
                        className="px-8 py-3 bg-white border border-red-100 text-red-500 font-bold rounded-2xl shadow-sm hover:bg-red-50 transition-all flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout from Account
                    </button>
                </div>
            </div>
        </div>
    );
}
