import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CategoryRow from '../components/CategoryRow';
import ProductCard from '../components/ProductCard';
import QueryModal from '../components/QueryModal';

export default function Marketplace() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Feature State
    const [currentSlide, setCurrentSlide] = useState(0);
    const [visibleCount, setVisibleCount] = useState(8);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Carousel Autoplay
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 2);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

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

    const handleQuery = (product) => {
        if (!user) {
            alert("Please login to send inquiries.");
            return;
        }
        setSelectedProduct(product);
    };

    return (
        <div className="bg-farm-earth min-h-screen text-slate-900 font-sans grainy-overlay">
            <Navbar onSearch={setSearch} />

            <main className="max-w-[1600px] mx-auto pb-32">
                {/* Optimized Hero Carousel - Full Width on Mobile */}
                <div className="relative overflow-hidden mb-6 h-[200px] md:h-[300px] lg:h-[350px] shadow-sm group bg-white transition-all duration-300 md:rounded-3xl md:mx-6 lg:mx-12">
                    {[
                        {
                            img: "/assets/namaste_banner.png",
                            title: "Namaste",
                            highlight: "Welcome to kisanmandi.in",
                            desc: "Connecting rural India to the modern marketplace."
                        },
                        {
                            img: "/assets/indian_farms_banner.png",
                            title: "United for",
                            highlight: "Walking Together.",
                            desc: "Connecting rural India to the modern marketplace. Hand in hand, field to fork."
                        },
                        // {
                        //     img: "/assets/farmer_namaste_banner.png",
                        //     title: "",
                        //     highlight: "",
                        //     desc: ""
                        // }
                    ].map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <img src={slide.img} className="absolute inset-0 w-full h-full object-cover object-center" alt="Slide Visual" />

                            {/* Overlay content removed as per user request */}
                        </div>
                    ))}

                    {/* Indicators Centered on Mobile, Bottom-Right on Desktop */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:bottom-6 md:right-16 flex gap-2.5 z-20">
                        {[0, 1].map((i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${i === currentSlide ? 'w-10 bg-[#4ADE80]' : 'w-2.5 bg-white/30 hover:bg-white/60'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row px-5 md:px-6 lg:px-12">
                    <Sidebar selectedCategory={category} onSelectCategory={setCategory} />
                    <div className="flex-1 min-w-0">
                        {/* Main Page Title matching reference image */}
                        <div className="px-5 md:px-0 mt-2 mb-4 lg:hidden">
                            <h1 className="text-2xl font-black text-slate-900 leading-[1.1] tracking-tight">
                                Fresh Harvest<br />
                                <span className="text-farm-deep text-xl font-bold">From The Best Farms</span>
                            </h1>
                        </div>

                        {/* New Circular Category Row (Mobile/Tablet prioritized) */}
                        <div className="lg:hidden mb-6">
                            <CategoryRow selectedCategory={category} onSelectCategory={setCategory} />
                        </div>

                        <div className="flex flex-row items-center justify-between mb-4">
                            <div className="flex-1 min-w-0 text-left">
                                <h2 className="text-lg font-semibold text-slate-800 tracking-tight truncate">Fresh listings from farmers</h2>
                            </div>
                            <div className="shrink-0">
                                {/* Desktop/Tablet Sort (Text Based) - Hidden on Mobile */}
                                <div className="hidden md:flex bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm items-center gap-1">
                                    <span className="text-[10px] font-bold text-slate-400 font-sans uppercase tracking-widest whitespace-nowrap">
                                        Sort:
                                    </span>
                                    <select
                                        onChange={(e) => setSort(e.target.value)}
                                        className="bg-transparent border-none text-xs font-bold text-slate-700 focus:ring-0 cursor-pointer p-0 pr-6 leading-none h-full outline-none"
                                        value={sort}
                                    >
                                        <option value="relevance">Recommended</option>
                                        <option value="price_asc">Price: Low to High</option>
                                        <option value="price_desc">Price: High to Low</option>
                                    </select>
                                </div>

                                {/* Mobile Sort (Icon Based) - Visible only on Mobile */}
                                <div className="md:hidden relative">
                                    <button className="h-10 w-10 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center justify-center active:scale-95 transition-transform text-slate-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                                        </svg>
                                    </button>
                                    <select
                                        onChange={(e) => setSort(e.target.value)}
                                        className="absolute inset-0 w-full h-full opacity-0 z-10"
                                        value={sort}
                                    >
                                        <option value="relevance">Recommended</option>
                                        <option value="price_asc">Price: Low to High</option>
                                        <option value="price_desc">Price: High to Low</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Professional Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 animate-fade-in-up stagger-1">
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
                                    <ProductCard key={p.id} product={p} onQuery={handleQuery} />
                                ))
                            )}
                        </div>

                        {/* Pagination Button */}
                        {!loading && visibleCount < filteredProducts.length && (
                            <div className="flex justify-center pb-12">
                                <button
                                    onClick={() => setVisibleCount(prev => prev + 8)}
                                    className="group flex flex-col items-center gap-2 text-slate-400 hover:text-[#15803d]"
                                >
                                    <span className="text-xs font-bold uppercase tracking-widest">Show More</span>
                                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm group-hover:border-[#15803d] flex items-center justify-center transition-all">
                                        <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {selectedProduct && <QueryModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
        </div>
    );
}
