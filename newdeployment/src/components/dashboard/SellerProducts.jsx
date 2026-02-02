import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function SellerProducts({ onEdit, onAddNew }) {
    const { user } = useAuth();
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('seller_uid', user.id); // Normalized to snake_case

            if (error) {
                console.error("Error fetching products:", error);
                setProducts({});
            } else {
                // Convert array to object to match existing structure or refactor to array. 
                // Existing code expects object with keys.
                const productsObj = {};
                data.forEach(p => productsObj[p.id] = p);
                setProducts(productsObj);
            }
            setLoading(false);
        };

        fetchProducts();

        const subscription = supabase
            .channel('public:products')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products', filter: `seller_uid=eq.${user.id}` }, () => {
                fetchProducts();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [user]);

    const handleDelete = async (key, name) => {
        if (!confirm(`Warning: Deleting "${name}" will also permanently delete all buyer inquiries associated with it.\n\nAre you sure you want to proceed?`)) return;

        try {
            // First, try to delete all related queries. 
            // NOTE: This might fail silently (0 rows deleted) if RLS policies block it.
            // We rely on the Database Foreign Key "ON DELETE CASCADE" for the actual cleanup in that case.
            const { error: queriesError } = await supabase
                .from('queries')
                .delete()
                .eq('product_id', key);

            if (queriesError) {
                console.warn("Could not delete related queries (likely permission issue), proceeding to delete product hoping for ON DELETE CASCADE...", queriesError);
            }

            // Then, delete the product
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', key);

            if (error) {
                // Check for foreign key constraint violation (Postgres error code 23503)
                if (error.code === '23503') {
                    throw new Error("Cannot delete product because it has associated inquiries. Please contact admin to enable 'ON DELETE CASCADE' on the database.");
                }
                throw error;
            }

            // Optimistic update
            const newProducts = { ...products };
            delete newProducts[key];
            setProducts(newProducts);

            alert("Product and linked inquiries deleted successfully.");
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Error deleting product: " + error.message);
        }
    };

    if (loading) return <div className="text-center py-12 text-gray-400">Loading your products...</div>;

    const productKeys = Object.keys(products);

    return (
        <div className="dashboard-section">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#15803d]">Your Active Listings</h2>
                <button onClick={onAddNew} className="bg-[#15803d] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#14532D]">Add New +</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productKeys.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <span className="text-4xl block mb-2 opacity-50">🌾</span>
                        <p className="text-gray-400 font-bold mb-4">No harvest listed yet.</p>
                        <button onClick={onAddNew} className="text-[#15803d] font-bold underline">List your first crop</button>
                    </div>
                ) : (
                    productKeys.map(key => {
                        const p = products[key];
                        const imgCount = p.images ? p.images.length : (p.image ? 1 : 0);

                        return (
                            <div key={key} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                                <div className="h-48 w-full bg-gray-50 relative">
                                    <img src={p.image || (p.images ? p.images[0] : '/assets/placeholder.jpg')} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={p.name} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    {imgCount > 1 && <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">📷 {imgCount}</span>}
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-[#15803d] text-lg leading-tight line-clamp-1">{p.name}</h3>
                                        <span className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded-md font-bold border border-green-100 uppercase tracking-wide shrink-0 ml-2">{p.category || 'Others'}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-2 mb-4 h-8">{p.description || 'No description provided.'}</p>

                                    <div className="flex items-center justify-between mb-4 border-t border-dashed border-gray-100 pt-3">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Price</p>
                                            <p className="text-base font-extrabold text-[#15803d]">₹{p.price} <span className="text-xs font-medium text-gray-500">/ {p.unit}</span></p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Status</p>
                                            <p className="text-xs font-bold text-green-600 flex items-center gap-1 justify-end">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Active
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button onClick={() => onEdit({ id: key, ...p })} className="flex-1 bg-[#F3F6F4] text-[#15803d] px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-[#E8F5E9] transition flex items-center justify-center gap-1">
                                            <span>✏️</span> Edit
                                        </button>
                                        <button onClick={() => handleDelete(key, p.name)} className="flex-1 bg-red-50 text-red-600 px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-red-100 transition flex items-center justify-center gap-1">
                                            <span>🗑️</span> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
