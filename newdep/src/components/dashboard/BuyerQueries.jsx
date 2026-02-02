import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function BuyerQueries() {
    const { user } = useAuth();
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortDate, setSortDate] = useState('newest');

    useEffect(() => {
        if (!user) return;
        setLoading(true);

        const fetchQueries = async () => {
            const { data, error } = await supabase
                .from('queries')
                .select('*')
                .eq('buyer_uid', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching queries:", error);
                setQueries([]);
            } else {
                setQueries(data || []);
            }
            setLoading(false);
        };

        fetchQueries();

        // Real-time subscription (Optional, but good for UX)
        const subscription = supabase
            .channel('public:queries')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'queries', filter: `buyer_uid=eq.${user.id}` }, (payload) => {
                fetchQueries();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [user]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this inquiry?")) return;
        try {
            const { error } = await supabase
                .from('queries')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Optimistic update or refetch
            setQueries(prev => prev.filter(q => q.id !== id));
            alert("Inquiry Deleted");
        } catch (err) {
            console.error(err);
            alert("Failed to delete.");
        }
    };

    const filteredQueries = queries
        .filter(q => filterStatus === 'all' || (q.status || 'pending') === filterStatus)
        .sort((a, b) => sortDate === 'newest' ? new Date(b.created_at) - new Date(a.created_at) : new Date(a.created_at) - new Date(b.created_at));

    return (
        <div className="dashboard-section animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Sent Inquiries</h2>
                    <p className="text-sm text-gray-500 mt-1">Track your interactions with farmers.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="flex gap-3 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                        <select onChange={(e) => setFilterStatus(e.target.value)} className="bg-transparent border-none rounded-lg px-3 py-1.5 text-xs font-bold text-gray-700 focus:ring-0 cursor-pointer">
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <div className="w-px bg-gray-200 my-1"></div>
                        <select onChange={(e) => setSortDate(e.target.value)} className="bg-transparent border-none rounded-lg px-3 py-1.5 text-xs font-bold text-gray-700 focus:ring-0 cursor-pointer">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400 font-medium">Loading inquiries...</p>
                    </div>
                ) : filteredQueries.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-gray-300 font-bold text-sm">No inquiries found.</div>
                ) : (
                    filteredQueries.map(q => {
                        const date = new Date(q.created_at).toLocaleDateString();
                        const status = q.status || 'pending';

                        return (
                            <div key={q.id} className="bg-white rounded-[1.25rem] border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">{date}</span>
                                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${status === 'accepted' ? 'bg-green-100 text-green-700' : (status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700')}`}>
                                            {status.toUpperCase()}
                                        </span>
                                    </div>
                                    <button onClick={() => handleDelete(q.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100" title="Delete Inquiry">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>

                                <h3 className="font-bold text-green-900 text-lg mb-4 leading-tight">{q.product_name}</h3>

                                <div className="space-y-3 p-4 bg-gray-50/50 rounded-xl border border-gray-50">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400 font-bold text-xs uppercase">Farmer</span>
                                        <span className="font-bold text-gray-900">{q.farmer_name || 'Farmer Store'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400 font-bold text-xs uppercase">Quantity</span>
                                        <span className="font-bold text-green-700">{q.quantity}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400 font-bold text-xs uppercase">Location</span>
                                        <span className="font-medium text-gray-600 truncate max-w-[150px]">{q.buyer_address}</span>
                                    </div>
                                </div>

                                {q.message && <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-100 italic">" {q.message} "</div>}

                                <div className="mt-5 pt-4 border-t border-gray-50">
                                    <div className={`text-center py-2.5 px-4 rounded-xl ${status === 'accepted' ? 'bg-green-50 text-green-700' : (status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700')} text-xs font-bold uppercase tracking-wide`}>
                                        {status === 'accepted' ? 'Approved! Farmer will contact you.' : (status === 'rejected' ? 'Not available' : 'Waiting for Farmer to review')}
                                    </div>
                                    {status === 'accepted' && (
                                        <a href={`tel:${q.buyer_phone}`} className="mt-3 block w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl text-center shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                            Call Farmer
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
