import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function QueryModal({ product, onClose }) {
    const { user, userData } = useAuth();
    const [loading, setLoading] = useState(false);
    const formRef = useRef();
    const scrollContainerRef = useRef(null);

    // Carousel State
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!product) return null;

    const images = product.images || (product.image ? [product.image] : ['/assets/placeholder.jpg']);

    const scrollNext = () => {
        if (currentImageIndex < images.length - 1) {
            setCurrentImageIndex(prev => prev + 1);
            scrollContainerRef.current.scrollBy({ left: scrollContainerRef.current.clientWidth, behavior: 'smooth' });
        }
    };

    const scrollPrev = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(prev => prev - 1);
            scrollContainerRef.current.scrollBy({ left: -scrollContainerRef.current.clientWidth, behavior: 'smooth' });
        }
    };

    const handleSubmit = async (e) => {
        // ... (existing submit logic remains unchanged) ...
        e.preventDefault();
        if (!user) {
            alert("Please login to send inquiries.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData(e.target);
            const queryDetails = {
                product_id: product.id,
                product_name: product.name,
                farmer_uid: product.seller_uid,
                farmer_name: product.seller_name,
                buyer_uid: user.id,
                buyer_name: userData?.name || user.email || "Buyer",
                buyer_phone: formData.get('phone'),
                buyer_address: formData.get('address'),
                buyer_pincode: formData.get('pincode'),
                quantity: formData.get('quantity'),
                message: formData.get('message'),
                status: 'pending'
            };

            const { error } = await supabase
                .from('queries')
                .insert([queryDetails]);

            if (error) throw error;

            alert("✅ Inquiry Sent!");
            onClose();
        } catch (err) {
            alert("❌ " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <div className="absolute inset-0 bg-green-950/80 backdrop-blur-md" onClick={onClose}></div>

            {/* Modal Container: Height fix for mobile scroll */}
            <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden animate-fade-up flex flex-col md:flex-row h-[85vh] max-h-[800px]">

                {/* Left Section: Image Carousel (Takes 50% on Desktop, Reduced height on Mobile) */}
                <div className="relative h-44 md:h-full md:w-1/2 shrink-0 bg-slate-900">
                    <div
                        ref={scrollContainerRef}
                        className="w-full h-full flex overflow-x-auto hide-scrollbar snap-x snap-mandatory scroll-smooth"
                    >
                        {images.map((img, i) => (
                            <img key={i} src={img} className="min-w-full h-full object-cover snap-center opacity-90" alt="Product" />
                        ))}
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none md:bg-gradient-to-r md:from-transparent md:to-black/10"></div>

                    {/* Navigation Arrows (Desktop Only or always if multiple images) */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={scrollPrev}
                                disabled={currentImageIndex === 0}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-2 rounded-full disabled:opacity-0 transition-all z-20"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button
                                onClick={scrollNext}
                                disabled={currentImageIndex === images.length - 1}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-2 rounded-full disabled:opacity-0 transition-all z-20"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </>
                    )}

                    {/* Close Button Mobile (Absolute Top Right) */}
                    <button onClick={onClose} className="absolute top-4 right-4 md:hidden bg-black/40 text-white rounded-full p-2 z-50">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    {/* Product Info Overlay (Mobile Only) */}
                    <div className="absolute bottom-6 left-6 text-white md:hidden z-20">
                        <h2 className="text-2xl font-black leading-tight drop-shadow-md">{product.name}</h2>
                        <p className="text-lg font-bold text-yellow-400 drop-shadow-md">₹{product.price} / {product.unit}</p>
                    </div>
                </div>

                {/* Right Section: Form */}
                <div className="flex-1 flex flex-col h-full bg-white relative min-h-0">

                    {/* Desktop Header / Close Button */}
                    <div className="hidden md:flex justify-between items-center px-8 py-6 border-b border-slate-100 sticky top-0 bg-white z-10 shrink-0">
                        <div>
                            <h2 className="text-2xl font-black text-green-900">{product.name}</h2>
                            <p className="text-sm font-medium text-slate-500">₹{product.price} / {product.unit}</p>
                        </div>
                        <button onClick={onClose} className="bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full p-2 transition-all">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Scrollable Form Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        {/* Farmer Card */}
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                            <img src={product.seller_image || '/assets/farmer_avatar_new.png'} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" alt="Farmer" />
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grower</p>
                                <p className="text-sm font-black text-green-900">{product.seller_name}</p>
                                <p className="text-xs text-green-700">{product.seller_loc}</p>
                            </div>
                        </div>

                        {/* Product Description */}
                        {product.description && (
                            <div className="mb-6">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Description</p>
                                <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Delivery Address</label>
                                    <input name="address" type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base md:text-sm font-semibold focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none" placeholder="Full street address..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Quantity</label>
                                        <input name="quantity" type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base md:text-sm font-semibold focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none" placeholder="e.g. 100 kg" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Pin Code</label>
                                        <input name="pincode" type="number" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base md:text-sm font-semibold focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none" placeholder="123456" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                                    <input name="phone" type="tel" defaultValue={userData?.phone || ""} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base md:text-sm font-semibold focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none" placeholder="+91 98765 43210" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Message (Optional)</label>
                                    <textarea name="message" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base md:text-sm font-semibold focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none h-20 resize-none" placeholder="Any special requirements?"></textarea>
                                </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex gap-3 items-start">
                                <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
                                    By submitting, you agree to share your contact details with this farmer. They will contact you directly to finalize the sale.
                                </p>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-green-800 hover:bg-green-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4">
                                {loading ? "Sending..." : "Submit Inquiry"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
