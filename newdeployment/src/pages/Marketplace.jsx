import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CategoryRow from '../components/CategoryRow';
import ProductCard from '../components/ProductCard';

export default function Marketplace() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // State
    const [visibleCount, setVisibleCount] = useState(8);

    // Sync State with URL
    const search = searchParams.get('search') || "";
    const category = searchParams.get('category') || "All Produce";
    const sort = searchParams.get('sort') || "relevance";

    const setSearch = (val) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            if (val) newParams.set('search', val); else newParams.delete('search');
            return newParams;
        });
    };

    const setCategory = (val) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            if (val) newParams.set('category', val); else newParams.delete('category');
            return newParams;
        });
    };

    const setSort = (val) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            if (val) newParams.set('sort', val); else newParams.delete('sort');
            return newParams;
        });
    };

    useEffect(() => {
        const fetchProducts = async () => {
            // 1. Try to load from Cache first for Instant Load (Keep this logic)
            const cachedData = localStorage.getItem('kisan_products_cache');
            if (cachedData) {
                try {
                    const { data, timestamp } = JSON.parse(cachedData);
                    if (Date.now() - timestamp < 3600000) {
                        setAllProducts(data);
                        setFilteredProducts(data);
                        setLoading(false);
                    }
                } catch (e) {
                    console.error("Cache parse error", e);
                }
            }

            // 2. Fetch fresh data from Supabase
            try {
                // Fetch products
                const { data: productsData, error: productsError } = await supabase
                    .from('products')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (productsError) throw productsError;

                if (productsData && productsData.length > 0) {
                    // Manual Join for User Data (to ensure fresh images/names)
                    const sellerIds = [...new Set(productsData.map(p => p.seller_uid))];

                    const { data: usersData, error: usersError } = await supabase
                        .from('users')
                        .select('id, name, city, state, profileImage')
                        .in('id', sellerIds);

                    if (usersError) console.error("Error fetching sellers:", usersError);

                    const usersMap = {};
                    if (usersData) {
                        usersData.forEach(u => {
                            usersMap[u.id] = u;
                        });
                    }

                    const mergedProducts = productsData.map(p => {
                        const seller = usersMap[p.seller_uid];
                        return {
                            ...p,
                            seller_name: seller?.name || p.seller_name || "Farmer",
                            seller_loc: (seller?.city ? seller.city + (seller.state ? ', ' + seller.state : '') : null) || p.seller_loc || "India",
                            seller_image: seller?.profileImage || p.seller_image || '/assets/farmer_avatar_new.png'
                        };
                    });

                    // Update State
                    setAllProducts(mergedProducts);
                    setFilteredProducts(mergedProducts);

                    // Update Cache
                    localStorage.setItem('kisan_products_cache', JSON.stringify({
                        data: mergedProducts,
                        timestamp: Date.now()
                    }));
                } else {
                    setAllProducts([]);
                    setFilteredProducts([]);
                }
            } catch (err) {
                console.error("Failed to load products from Supabase", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        let filtered = [...allProducts];
        if (category !== "All Produce") {
            filtered = filtered.filter(p => p.category === category);
        }
        if (search) {
            const lowerSearch = search.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(lowerSearch) ||
                (p.description || "").toLowerCase().includes(lowerSearch)
            );
        }
        if (sort === 'price_asc') {
            filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (sort === 'price_desc') {
            filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }
        setFilteredProducts(filtered);
    }, [search, category, sort, allProducts]);

    return (
        <div className="bg-farm-earth min-h-screen text-slate-900 font-sans grainy-overlay">
            <Navbar onSearch={setSearch} />

            <main className="max-w-[1600px] mx-auto pt-4 md:pt-8 pb-32 min-h-screen bg-white shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100/50">
                {/* Namaste Banner - Static Hero matching reference image */}
                {/* Namaste Banner - Premium Card Style with Frame */}
                <div className="relative mx-3 md:mx-10 lg:mx-20 mb-6">
                    <div className="max-w-5xl mx-auto relative overflow-hidden bg-white rounded-[2rem] shadow-xl border border-slate-100 p-2 md:p-3 ring-1 ring-slate-50/50">
                        <img
                            src="/assets/namaste_banner.png"
                            className="w-full h-auto rounded-[1.5rem]"
                            alt="Namaste Banner"
                        />
                    </div>
                </div>

                <div className="px-4 md:px-10 lg:px-20 py-6 flex flex-col gap-2">
                    <div className="min-w-0">
                        {/* New Circular Category Row (Always visible for mobile feel) */}
                        <div className="mb-10">
                            <CategoryRow selectedCategory={category} onSelectCategory={setCategory} />
                        </div>

                        <div className="flex flex-row items-end justify-between mb-8 px-1">
                            <div className="flex-1 min-w-0 text-left">
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1.5">Verified Harvest</p>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                                    {category === "All Produce" ? "Seasonal Produce" : category}
                                </h2>
                            </div>

                            <div className="shrink-0 pb-1">
                                <div className="relative">
                                    <button className="h-10 w-10 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-center active:scale-95 transition-transform text-slate-700 ring-1 ring-slate-100/50">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                                        </svg>
                                    </button>
                                    <select
                                        onChange={(e) => setSort(e.target.value)}
                                        className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                        value={sort}
                                    >
                                        <option value="relevance">Recommended</option>
                                        <option value="price_asc">Price: Low to High</option>
                                        <option value="price_desc">Price: High to Low</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* App-Style Grid - Dense and Responsive */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 md:gap-6 mb-12">
                            {loading ? (
                                Array(8).fill(0).map((_, i) => (
                                    <div key={i} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 animate-pulse h-[280px]">
                                        <div className="h-40 bg-slate-100 rounded-2xl mb-4"></div>
                                        <div className="h-4 bg-slate-100 rounded-full w-2/3 mb-2"></div>
                                        <div className="h-4 bg-slate-100 rounded-full w-1/3"></div>
                                    </div>
                                ))
                            ) : filteredProducts.length === 0 ? (
                                <div className="col-span-full py-32 flex flex-col items-center text-center animate-fade-up">
                                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                                        <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Harvest Found</h3>
                                    <button onClick={() => { setCategory("All Produce"); setSearch(""); }} className="bg-[#15803d] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg mt-4">Clear All Filters</button>
                                </div>
                            ) : (
                                filteredProducts.slice(0, visibleCount).map(p => (
                                    <ProductCard key={p.id} product={p} onQuery={(p) => navigate('/enquiry', { state: { product: p } })} />
                                ))
                            )}
                        </div>

                        {!loading && visibleCount < filteredProducts.length && (
                            <div className="flex justify-center pb-12 px-4">
                                <button
                                    onClick={() => setVisibleCount(prev => prev + 8)}
                                    className="w-full py-4 rounded-2xl bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-slate-100 hover:text-emerald-700 transition-all active:scale-95 border border-slate-100"
                                >
                                    Load More Harvest
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
