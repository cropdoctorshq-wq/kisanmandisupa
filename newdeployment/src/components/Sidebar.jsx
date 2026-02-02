export default function Sidebar({ selectedCategory, onSelectCategory }) {
    const categories = [
        { name: "All Produce", icon: "/assets/categories/cat_all.png" },
        { name: "Plants", icon: "/assets/categories/cat_plants.png" },
        { name: "Seeds", icon: "/assets/categories/cat_seeds.png" },
        { name: "Grains", icon: "/assets/categories/cat_grains.png" },
        { name: "Dairy", icon: "/assets/categories/cat_dairy.png" },
        { name: "Fruits", icon: "/assets/categories/cat_fruits.png" },
        { name: "Vegetables", icon: "/assets/categories/cat_vegetables.png" },
        { name: "Pesticides", icon: "/assets/categories/cat_pesticides.png" },
        { name: "Manure", icon: "/assets/categories/cat_manure.png" },
        { name: "Others", icon: "/assets/categories/cat_others.png" }
    ];

    return (
        <aside className="hidden lg:block lg:w-72 shrink-0 lg:sticky lg:top-24 h-fit pr-8">
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                <h3 className="font-black text-slate-800 text-[10px] mb-8 uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
                    Market Categories
                </h3>
                <ul className="space-y-2">
                    {categories.map((c) => (
                        <li key={c.name}>
                            <button
                                onClick={() => onSelectCategory(c.name)}
                                className={`w-full text-left px-4 py-3 rounded-2xl text-[13px] font-extrabold transition-all flex items-center gap-4 group ${selectedCategory === c.name
                                    ? "bg-emerald-50 text-emerald-800 shadow-sm ring-1 ring-emerald-100"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-emerald-700"
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedCategory === c.name ? 'bg-white shadow-sm' : 'bg-slate-50 group-hover:bg-white group-hover:shadow-sm'}`}>
                                    <img src={c.icon} className="w-6 h-6 object-contain" alt="" />
                                </div>
                                {c.name}
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="mt-10 pt-8 border-t border-slate-50">
                    <div className="bg-emerald-900 rounded-3xl p-6 text-white overflow-hidden relative group">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Direct from</p>
                            <h4 className="text-lg font-black leading-tight">Verified <br />Growers</h4>
                        </div>
                        <img src="/assets/categories/cat_grains.png" className="absolute -bottom-4 -right-4 w-24 h-24 opacity-20 rotate-12 transition-transform group-hover:scale-125" alt="" />
                    </div>
                </div>
            </div>
        </aside>
    );
}
