import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import ProductCard from './ProductCard'; // Reusing the card for consistent look
import QueryModal from './QueryModal'; // Reuse modal for actions

export default function SearchOverlay({ onClose, isOpen }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [visibleCount, setVisibleCount] = useState(10); // Start with 10 items
    const inputRef = useRef(null);

    // Fetch products on mount if open
    useEffect(() => {
        if (isOpen && allProducts.length === 0) {
            const fetchProducts = async () => {
                try {
                    const { data, error } = await supabase
                        .from('products')
                        .select('*')
                        .order('created_at', { ascending: false });

                    if (error) throw error;

                    if (data) {
                        setAllProducts(data);
                    }
                } catch (err) {
                    console.error("Search fetch error", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchProducts();
        }
    }, [isOpen]);

    // Live Filter
    useEffect(() => {
        if (!searchTerm) {
            setFilteredProducts([]);
            return;
        }
        const lower = searchTerm.toLowerCase();
        const results = allProducts.filter(p =>
            p.name.toLowerCase().includes(lower) ||
            (p.category || "").toLowerCase().includes(lower) ||
            (p.description || "").toLowerCase().includes(lower)
        );
        setFilteredProducts(results);
    }, [searchTerm, allProducts]);

    // Auto-focus logic
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-farm-earth flex flex-col animate-fade-up">
            {/* Header */}
            <div className="bg-white px-4 py-4 pt-safe-top border-b border-slate-100 flex items-center gap-3 shrink-0 shadow-sm">
                <button onClick={onClose} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="flex-1 relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-100 border-none rounded-xl py-3 pl-12 pr-4 text-base font-bold text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-farm-deep transition-all"
                        placeholder="Search crops, fruits..."
                    />
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 animate-pulse">
                                <div className="w-16 h-16 rounded-xl bg-slate-100"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                                    <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : searchTerm ? (
                    filteredProducts.length > 0 ? (
                        <>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Results</p>
                            <div className="grid grid-cols-1 gap-4">
                                {filteredProducts.slice(0, visibleCount).map(p => (
                                    <div key={p.id} onClick={() => setSelectedProduct(p)} className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm active:scale-98 transition-transform">
                                        <img src={p.images?.[0] || p.image || '/assets/placeholder.jpg'} className="w-16 h-16 rounded-xl object-cover bg-slate-100" />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-farm-deep text-sm line-clamp-1">{p.name}</h4>
                                            <p className="text-xs text-slate-500">{p.seller_name} • {p.seller_loc}</p>
                                            <p className="text-sm font-black text-farm-accent mt-1">₹{p.price} / {p.unit}</p>
                                        </div>
                                        <button className="bg-farm-earth p-2 rounded-full text-farm-deep">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Load More Button */}
                            {visibleCount < filteredProducts.length && (
                                <button
                                    onClick={() => setVisibleCount(prev => prev + 10)}
                                    className="w-full py-4 mt-6 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-farm-deep transition-colors"
                                >
                                    Show More ({filteredProducts.length - visibleCount} remaining)
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20 text-slate-400">
                            <p className="font-bold">No results found</p>
                            <p className="text-xs mt-1">Try searching for 'Rice', 'Wheat', etc.</p>
                        </div>
                    )
                ) : (
                    // Default State (Trending / Recent)
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Popular Categories</p>
                        <div className="flex flex-wrap gap-2">
                            {["Vegetables", "Fruits", "Grains", "Pulses", "Spices", "Dairy", "Seeds", "Manure", "Pesticides", "Others"].map(c => (
                                <button key={c} onClick={() => setSearchTerm(c)} className="px-4 py-2 bg-white border border-slate-100 rounded-lg text-sm font-bold text-slate-600 active:bg-slate-50">
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Nested Modal for Selection */}
            {selectedProduct && <QueryModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
        </div>
    );
}
