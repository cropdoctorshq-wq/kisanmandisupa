export default function ProductCard({ product, onQuery }) {
    const timeAgo = (timestamp) => {
        if (!timestamp) return 'Recently';
        const diff = Date.now() - new Date(timestamp).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    const images = product.images || (product.image ? [product.image] : ['/assets/placeholder.jpg']);

    return (
        <div className="farm-card group rounded-2xl overflow-hidden flex flex-col h-full border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 bg-white hover:-translate-y-1">
            {/* Professional Image Holder */}
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-50 group-hover:opacity-95 transition-opacity">
                <img
                    src={images[0]}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={product.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-3 left-3">
                    <span className="bg-white/95 backdrop-blur-sm text-farm-deep text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider font-sans border border-farm-deep/10">
                        {product.category || 'Fresh'}
                    </span>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="space-y-1.5">
                    <div className="flex justify-between items-start gap-4">
                        <h3 className="text-lg font-bold text-slate-900 leading-snug font-sans group-hover:text-[#15803d] transition-colors line-clamp-2">
                            {product.name}
                        </h3>
                        <div className="text-right shrink-0">
                            <span className="text-lg font-black text-[#15803d] block font-sans">₹{product.price}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide font-sans">/ {product.unit || 'kg'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500 pb-2">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs font-medium tracking-wide font-sans truncate text-slate-600">
                            {product.seller_loc || [product.city, product.state].filter(Boolean).join(', ') || 'Verified Farm'}
                        </span>
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 group/seller cursor-pointer">
                        <div className="relative">
                            <img
                                src={product.seller_image || '/assets/farmer_avatar_new.png'}
                                className="h-9 w-9 rounded-full object-cover border-2 border-white shadow-sm group-hover/seller:border-emerald-100 transition-colors"
                                alt="Seller"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 w-2.5 h-2.5 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900 leading-none mb-1 font-sans group-hover/seller:text-[#15803d] transition-colors">
                                {product.seller_name ? product.seller_name.split(' ')[0] : 'Grower'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium font-sans">{timeAgo(product.created_at)}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => onQuery(product)}
                        className="bg-[#15803d] hover:bg-[#126631] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/10 hover:shadow-emerald-900/20 hover:-translate-y-0.5 active:scale-95 font-sans"
                    >
                        <span>Enquire</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
