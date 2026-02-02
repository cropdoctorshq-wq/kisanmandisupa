import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import AddProductForm from '../components/dashboard/AddProductForm';
import SellerProducts from '../components/dashboard/SellerProducts';
import SellerProfile from '../components/dashboard/SellerProfile';
import SellerQueries from '../components/dashboard/SellerQueries';
import { Link, useNavigate } from 'react-router-dom';



export default function SellerDashboard() {
    const { user, logout, userData, loading } = useAuth();
    const navigate = useNavigate();
    const [currentSection, setCurrentSection] = useState('products');
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        if (!loading && !user) navigate('/');
        if (!loading && user && userData && userData.role !== 'seller' && userData.role !== 'farmer') {
            alert("Access Denied: Seller only area.");
            navigate('/home');
        }
    }, [user, loading, userData, navigate]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#15803d] border-t-transparent rounded-full animate-spin"></div></div>;

    if (!userData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#FCFAF7]">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-md">
                    <div className="text-4xl mb-4">🚜</div>
                    <h2 className="text-2xl font-black text-slate-800 mb-2">Profile Missing</h2>
                    <p className="text-slate-500 mb-6 font-medium">We couldn't load your farmer profile. If you just signed up, please verify your email or try refreshing.</p>
                    <div className="flex flex-col gap-3">
                        <button onClick={() => window.location.reload()} className="w-full bg-[#15803d] text-white py-3 rounded-xl font-bold shadow-lg">Refresh Page</button>
                        <button onClick={logout} className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-bold">Sign Out</button>
                    </div>
                </div>
            </div>
        );
    }

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setCurrentSection('add');
    };

    const handleProductAdded = () => {
        setEditingProduct(null);
        setCurrentSection('products');
    };

    return (
        <div className="organic-texture bg-[#FCFAF7] min-h-screen font-sans text-slate-900">
            <Navbar onSearch={() => { }} />

            {/* Mobile Top Tabs (Segmented Control) */}
            <div className="lg:hidden px-4 mt-4 mb-2">
                <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100 grid grid-cols-4 gap-1">
                    <button
                        onClick={() => setCurrentSection('products')}
                        className={`flex flex-col items-center justify-center py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${currentSection === 'products' ? 'bg-[#15803d] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <span>📦</span>
                        <span>Products</span>
                    </button>
                    <button
                        onClick={() => { setCurrentSection('add'); setEditingProduct(null); }}
                        className={`flex flex-col items-center justify-center py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${currentSection === 'add' ? 'bg-[#15803d] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <span>➕</span>
                        <span>Add</span>
                    </button>
                    <button
                        onClick={() => setCurrentSection('queries')}
                        className={`flex flex-col items-center justify-center py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${currentSection === 'queries' ? 'bg-[#15803d] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <span>💬</span>
                        <span>Queries</span>
                    </button>
                    <button
                        onClick={() => setCurrentSection('profile')}
                        className={`flex flex-col items-center justify-center py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${currentSection === 'profile' ? 'bg-[#15803d] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <span>👤</span>
                        <span>Profile</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 pb-24">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Nav (Desktop Only) */}
                    <aside className="hidden lg:block w-full lg:w-64 shrink-0 space-y-4">
                        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-4 sticky top-24 shadow-sm">
                            <nav className="space-y-2">
                                <button onClick={() => setCurrentSection('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold ${currentSection === 'products' ? 'bg-[#15803d]/10 text-[#15803d] shadow-sm ring-1 ring-[#15803d]/20' : 'text-slate-600 hover:bg-slate-50'}`}>
                                    <span className="text-lg">📦</span>
                                    <span>My Products</span>
                                </button>
                                <button onClick={() => { setCurrentSection('add'); setEditingProduct(null); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold ${currentSection === 'add' ? 'bg-[#15803d]/10 text-[#15803d] shadow-sm ring-1 ring-[#15803d]/20' : 'text-slate-600 hover:bg-slate-50'}`}>
                                    <span className="text-lg">➕</span>
                                    <span>Add Harvest</span>
                                </button>
                                <button onClick={() => setCurrentSection('queries')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold ${currentSection === 'queries' ? 'bg-[#15803d]/10 text-[#15803d] shadow-sm ring-1 ring-[#15803d]/20' : 'text-slate-600 hover:bg-slate-50'}`}>
                                    <span className="text-lg">💬</span>
                                    <span>Queries</span>
                                </button>
                                <button onClick={() => setCurrentSection('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold ${currentSection === 'profile' ? 'bg-[#15803d]/10 text-[#15803d] shadow-sm ring-1 ring-[#15803d]/20' : 'text-slate-600 hover:bg-slate-50'}`}>
                                    <span className="text-lg">👤</span>
                                    <span>Profile</span>
                                </button>
                                <hr className="my-2 border-slate-100" />
                                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl text-red-500 hover:bg-red-50 transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                    <span>Logout</span>
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
                                <span className="inline-block py-1 px-3 rounded-full bg-white/20 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest mb-3 backdrop-blur-md">Seller Panel</span>
                                <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-2 drop-shadow-md">Manage Your <span className="text-emerald-400">Harvest</span></h1>
                                <p className="text-slate-100 text-sm md:text-base font-medium max-w-lg drop-shadow-md">Track your inventory, add new crops, and respond to buyer queries.</p>
                            </div>
                        </div>

                        {currentSection === 'products' && (
                            <SellerProducts onEdit={handleEditProduct} onAddNew={() => { setCurrentSection('add'); setEditingProduct(null); }} />
                        )}

                        {currentSection === 'add' && (
                            <AddProductForm
                                onProductAdded={handleProductAdded}
                                editingProduct={editingProduct}
                                onCancelEdit={() => { setEditingProduct(null); setCurrentSection('products'); }}
                            />
                        )}

                        {currentSection === 'profile' && <SellerProfile />}

                        {currentSection === 'queries' && <SellerQueries />}
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
