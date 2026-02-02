import React from 'react';

export default function CategoryRow({ selectedCategory, onSelectCategory }) {
    const categories = [
        { name: "All", icon: "🌈" },
        { name: "Vegetables", icon: "🥬" },
        { name: "Fruits", icon: "🍎" },
        { name: "Grains", icon: "🌾" },
        { name: "Pulses", icon: "🥘" },
        { name: "Spices", icon: "🌶️" },
        { name: "Dairy", icon: "🥛" },
        { name: "Seeds", icon: "🌱" },
        { name: "Manure", icon: "💩" },
        { name: "Pesticides", icon: "🧪" },
        { name: "Others", icon: "📦" }
    ];

    return (
        <div className="w-full">
            <div className="w-full overflow-x-auto hide-scrollbar mx-[-1.25rem] w-[calc(100%+2.5rem)]">
                <div className="flex gap-2 px-5 min-w-max pt-2 pb-4">
                    {categories.map((c) => (
                        <button
                            key={c.name}
                            onClick={() => onSelectCategory(c.name === 'All' ? 'All Produce' : c.name)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 whitespace-nowrap border ${(selectedCategory === c.name || (c.name === 'All' && selectedCategory === 'All Produce'))
                                    ? 'bg-[#15803d] text-white border-[#15803d] shadow-sm'
                                    : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
                                }`}
                        >
                            <span className="text-base">{c.icon}</span>
                            <span className="text-xs font-bold tracking-tight">
                                {c.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
