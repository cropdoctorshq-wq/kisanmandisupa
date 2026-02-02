import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function SellerQueries() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('received');
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        setLoading(true);

        const fetchQueries = async () => {
            let query = supabase
                .from('queries')
                .select('*');

            if (activeTab === 'received') {
                query = query.eq('farmer_uid', user.id);
            } else {
                query = query.eq('buyer_uid', user.id);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching queries:", error);
                setQueries([]);
            } else {
                setQueries(data || []);
            }
            setLoading(false);
        };

        fetchQueries();

        // Real-time updates
        const subscription = supabase
            .channel('public:queries')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'queries' }, (payload) => {
                // Ideally filter here or just refetch. Refetching for simplicity.
                fetchQueries();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [user, activeTab]);

    const handleStatus = async (queryId, buyer_uid, status) => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from('queries')
                .update({ status })
                .eq('id', queryId);

            if (error) throw error;

            // Optimistic update
            setQueries(prev => prev.map(q => q.id === queryId ? { ...q, status } : q));

        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    return (
        <div className="dashboard-section">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <h2 className="text-2xl font-bold text-[#15803d]">Manage Inquiries</h2>

                {/* Tabs */}
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="flex bg-white/50 p-1 rounded-xl border border-[#E8E6DF] shadow-sm">
                        <button
                            onClick={() => setActiveTab('received')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'received' ? 'bg-[#15803d] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Received
                        </button>
                        <button
                            onClick={() => setActiveTab('sent')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'sent' ? 'bg-[#15803d] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Sent
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 text-center text-gray-400">Loading queries...</div>
                ) : queries.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-400">No {activeTab} inquiries found.</div>
                ) : (
                    queries.map(q => (
                        <div key={q.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-[#15803d] text-lg">{q.product_name}</h4>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${q.status === 'accepted' ? 'bg-green-100 text-green-800' : q.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {q.status || 'pending'}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400 font-bold">{new Date(q.created_at).toLocaleDateString()}</span>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div className="flex items-start gap-2">
                                    <span className="text-sm">👤</span>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">{activeTab === 'received' ? 'Buyer' : 'Seller'}</p>
                                        <p className="font-bold text-[#1A2E1F]">{activeTab === 'received' ? q.buyer_name : (q.farmer_name || 'Farmer')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-sm">📦</span>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Quantity</p>
                                        <p className="font-bold text-[#15803d]">{q.quantity}</p>
                                    </div>
                                </div>
                                {q.message && (
                                    <div className="mt-2 bg-[#FDFBF7] p-3 rounded-xl border border-[#E8E6DF]">
                                        <p className="text-xs text-gray-500 italic">"{q.message}"</p>
                                    </div>
                                )}

                                {activeTab === 'received' && (
                                    <div className="mt-2 pt-2 border-t border-dashed border-gray-100">
                                        <p className="text-xs text-gray-500"><span className="font-bold">Location:</span> {q.buyer_address} {q.buyer_pincode ? `- ${q.buyer_pincode}` : ''}</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-50">
                                {activeTab === 'received' ? (
                                    <>
                                        {(!q.status || q.status === 'pending') && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleStatus(q.id, q.buyer_uid, 'accepted')}
                                                    className="flex-1 bg-[#15803d] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#143D24] transition"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleStatus(q.id, q.buyer_uid, 'rejected')}
                                                    className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-xl text-sm font-bold hover:bg-red-100 transition"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                        {q.status === 'accepted' && (
                                            <a href={`tel:${q.buyer_phone}`} className="flex items-center justify-center gap-2 w-full bg-[#1A9642] text-white py-3 rounded-xl text-sm font-bold hover:bg-[#143D24] transition shadow-lg shadow-green-900/10">
                                                <span>📞</span> Call Buyer
                                            </a>
                                        )}
                                        {q.status === 'rejected' && (
                                            <div className="text-center py-2 px-4 rounded-xl bg-gray-100 text-gray-500 text-xs font-bold">
                                                Inquiry Rejected
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-2 px-4 rounded-xl bg-gray-50 text-gray-600 text-xs font-bold">
                                        {q.status === 'accepted' ? 'Farmer approved! They will contact you.' : q.status === 'rejected' ? 'Farmer declined this request.' : 'Waiting for Farmer response...'}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
