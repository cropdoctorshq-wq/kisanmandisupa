import React from 'react';

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
        <div className="bg-white rounded-[1.5rem] overflow-hidden shadow-lg border border-slate-100 flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group ring-1 ring-slate-100/50">
            {/* Top: Product Image */}
            <div className="aspect-square w-full bg-slate-50 relative overflow-hidden">
                <img
                    src={images[0]}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={product.name}
                />

                {/* Category Tag */}
                <div className="absolute top-2 left-2">
                    <span className="bg-white/95 backdrop-blur-md text-[9px] font-bold px-2 py-0.5 rounded-full text-emerald-700 shadow-sm border border-emerald-50 uppercase tracking-wide">
                        {product.category || 'Fresh'}
                    </span>
                </div>

                {/* Price Tag Overlay - More Integrated */}
                <div className="absolute bottom-0 right-0 p-1.5">
                    <div className="bg-emerald-600 text-white px-2.5 py-1 rounded-lg shadow-lg flex items-baseline gap-0.5 border border-emerald-500/20">
                        <span className="text-sm font-black tracking-tight">₹{product.price}</span>
                        <span className="text-[9px] font-bold opacity-80 uppercase">/{product.unit || 'kg'}</span>
                    </div>
                </div>
            </div>

            {/* Bottom: Content */}
            <div className="p-2.5 flex flex-col flex-1 gap-2">

                {/* Title & Location Block */}
                <div className="min-h-[2.5rem]">
                    <h3 className="text-[13px] font-extrabold text-slate-800 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-1 text-slate-400 mt-0.5">
                        <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <circle cx="12" cy="11" r="3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-[10px] font-bold truncate tracking-tight">
                            {product.seller_loc ? product.seller_loc.split(',')[0] : 'Verified Farm'}
                        </span>
                    </div>
                </div>

                {/* Divider with subtle gradient */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-100 to-transparent"></div>

                {/* Seller & Action Footer */}
                <div className="flex items-center justify-between gap-2 mt-auto">
                    {/* Seller Info (Compact) */}
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <img
                            src={product.seller_image || '/assets/farmer_avatar_new.png'}
                            className="h-7 w-7 rounded-full border border-slate-100 shadow-sm shrink-0 bg-slate-50 object-cover"
                            alt="Seller"
                        />
                        <div className="flex flex-col min-w-0 leading-none gap-0.5">
                            <span className="text-[10px] font-bold text-slate-700 truncate">
                                {product.seller_name ? product.seller_name.split(' ')[0] : 'Farmer'}
                            </span>
                            <span className="text-[8px] text-slate-400 font-medium">{timeAgo(product.created_at)}</span>
                        </div>
                    </div>

                    {/* Prominent CTA Button - Icon Only on smallest, text on larger */}
                    <button
                        onClick={() => onQuery(product)}
                        className="bg-gradient-to-br from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white shadow-md shadow-emerald-200 p-2 rounded-xl transition-all active:scale-95 flex items-center justify-center group/btn"
                        title="Enquire Now"
                    >
                        <span className="hidden sm:block text-[10px] font-black px-1">Enquire</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
