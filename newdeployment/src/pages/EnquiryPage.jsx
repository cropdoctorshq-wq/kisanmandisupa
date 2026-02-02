import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function EnquiryPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user, userData } = useAuth();
    const product = state?.product;

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!product) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
                <p className="text-slate-500 mb-4">No product selected.</p>
                <button onClick={() => navigate('/marketplace')} className="text-emerald-600 font-bold">
                    Back to Marketplace
                </button>
            </div>
        );
    }

    const images = product.images || (product.image ? [product.image] : ['/assets/placeholder.jpg']);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to send inquiries.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData(e.target);

            // Concatenate address fields
            const street = formData.get('street');
            const area = formData.get('area');
            const city = formData.get('city');
            const stateField = formData.get('state');
            const fullAddress = `${street}, ${area}, ${city}, ${stateField}`;

            const queryDetails = {
                product_id: product.id,
                product_name: product.name,
                farmer_uid: product.seller_uid,
                farmer_name: product.seller_name,
                buyer_uid: user.id,
                buyer_name: userData?.name || user.email || "Buyer",
                buyer_phone: formData.get('phone'),
                buyer_address: fullAddress,
                buyer_pincode: formData.get('pincode'),
                quantity: formData.get('quantity'),
                message: formData.get('message'),
                status: 'pending'
            };

            const { error } = await supabase
                .from('queries')
                .insert([queryDetails]);

            if (error) throw error;

            setSuccess(true);
            setTimeout(() => navigate('/marketplace'), 2000);
        } catch (err) {
            alert("❌ " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-farm-earth font-poppins pb-24 grainy-overlay">
            <Navbar />

            <main className="max-w-[1600px] mx-auto bg-white min-h-screen shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100/50 px-4 md:px-10 lg:px-20 pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

                    {/* Left: Sticky Product Image */}
                    <div className="relative h-64 lg:h-[calc(100vh-8rem)] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 lg:sticky lg:top-24 group shrink-0">
                        <img
                            src={images[0]}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt={product.name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                        {/* Back Button */}
                        <button
                            onClick={() => navigate(-1)}
                            className="absolute top-4 left-4 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all z-20 active:scale-95"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <div className="absolute bottom-6 left-6 right-6 text-white z-20">
                            <h1 className="text-3xl lg:text-5xl font-black leading-tight drop-shadow-lg mb-2">{product.name}</h1>
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                                <p className="text-xl lg:text-2xl font-black text-yellow-300 drop-shadow-md">₹{product.price}</p>
                                <span className="text-sm font-bold opacity-80 uppercase">/ {product.unit}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Scrollable Content (Info + Form) */}
                    <div className="flex flex-col gap-8 pb-20">

                        {/* Farmer Profile Card */}
                        <div className="flex items-center gap-5 bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <img src={product.seller_image || '/assets/farmer_avatar_new.png'} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md" alt="Farmer" />
                            <div>
                                <p className="text-2xl font-black text-slate-900 leading-tight mb-1">{product.seller_name}</p>
                                <p className="text-sm font-bold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-lg w-fit">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {product.seller_loc}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div>
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-1 flex items-center gap-2">
                                    <div className="w-6 h-0.5 bg-slate-200 rounded-full"></div>
                                    Harvest Details
                                </h3>
                                <p className="text-lg text-slate-600 leading-relaxed font-medium bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {/* Inquiry Form */}
                        <div className="mt-4">
                            {success ? (
                                <div className="bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-12 text-center animate-scale-up">
                                    <div className="w-24 h-24 bg-white text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-100">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-3xl font-black text-emerald-900 mb-2">Inquiry Sent!</h3>
                                    <p className="text-emerald-700 font-bold text-lg">The farmer will contact you directly.</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-[2.5rem] p-6 lg:p-10 shadow-2xl shadow-slate-200/50 border border-slate-100">
                                    <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                        <div className="w-2 h-10 bg-emerald-600 rounded-full"></div>
                                        Send Inquiry
                                    </h3>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="space-y-4">
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Delivery Address</label>
                                            <input name="street" type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none" placeholder="House No. / Street..." />
                                            <input name="area" type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none" placeholder="Area / Locality..." />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input name="city" type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none" placeholder="City" />
                                                <input name="state" type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none" placeholder="State" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-5 pt-2">
                                            <div>
                                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Quantity</label>
                                                <input name="quantity" type="text" required className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none" placeholder="e.g. 50 kg" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Pin Code</label>
                                                <input name="pincode" type="number" required className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none" placeholder="123456" />
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                                            <input name="phone" type="tel" defaultValue={userData?.phone || ""} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none" placeholder="+91 98765 43210" />
                                        </div>

                                        <div className="pt-2">
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Message (Optional)</label>
                                            <textarea name="message" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none h-32 resize-none" placeholder="Any special requirements or questions?"></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-900/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4 group"
                                        >
                                            {loading ? "Sending Details..." : "Submit Inquiry"}
                                            {!loading && (
                                                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <MobileBottomNav />
        </div >
    );
}
