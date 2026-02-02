import React from 'react';

export default function CategoryRow({ selectedCategory, onSelectCategory }) {
    const categories = [
        { name: "All", icon: "/assets/categories/all.png", id: "All Produce" },
        { name: "Plants", icon: "/assets/categories/plants.png", id: "Plants" },
        { name: "Seeds", icon: "/assets/categories/seeds.png", id: "Seeds" },
        { name: "Grains", icon: "/assets/categories/grains.png", id: "Grains" },
        { name: "Dairy", icon: "/assets/categories/dairy.png", id: "Dairy" },
        { name: "Fruits", icon: "/assets/categories/fruits.png", id: "Fruits" },
        { name: "Vegetables", icon: "/assets/categories/vegetables.png", id: "Vegetables" },
        { name: "Others", icon: "/assets/categories/others.png", id: "Others" },
        { name: "Pesticides", icon: "/assets/categories/pesticides.png", id: "Pesticides" },
        { name: "Manure", icon: "/assets/categories/manure.png", id: "Manure" }
    ];

    return (
        <div className="w-full px-2 md:px-0">
            <div className="max-w-6xl mx-auto grid grid-cols-5 md:grid-cols-10 gap-3 md:gap-4 md:px-6">
                {categories.map((c) => (
                    <button
                        key={c.name}
                        onClick={() => onSelectCategory(c.id)}
                        className={`group relative flex flex-col items-center gap-1.5 transition-all duration-300 active:scale-95`}
                    >
                        {/* Image Container - Premium 3D Look */}
                        <div className={`w-full aspect-square rounded-[1.2rem] overflow-hidden bg-white border transition-all duration-300 p-1 ${selectedCategory === c.id
                            ? 'border-emerald-500 ring-4 ring-emerald-50 shadow-2xl scale-[1.05] -translate-y-1'
                            : 'border-slate-100 shadow-lg group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-emerald-200 ring-1 ring-slate-50/50'
                            }`}>
                            <img
                                src={c.icon}
                                className="w-full h-full object-cover rounded-[0.8rem] transition-transform duration-500 group-hover:scale-110"
                                alt={c.name}
                            />
                        </div>

                        {/* Label */}
                        <span className={`text-[10px] md:text-xs font-bold text-center leading-tight transition-colors whitespace-nowrap ${selectedCategory === c.id ? 'text-emerald-700 font-extrabold' : 'text-slate-500 group-hover:text-emerald-600'
                            }`}>
                            {c.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
