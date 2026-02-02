export default function Sidebar({ selectedCategory, onSelectCategory }) {
    const categories = [
        { name: "All Produce", icon: "🌈" },
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
        <aside className="hidden lg:block lg:w-64 shrink-0 lg:sticky lg:top-28 h-fit">
            <div className="bg-white rounded-lg p-6 border border-farm-clay shadow-sm">
                <h3 className="font-bold text-farm-deep text-xs mb-6 uppercase tracking-widest flex items-center gap-2 border-b border-farm-clay/50 pb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-farm-accent"></span>
                    Filter by Type
                </h3>
                <ul className="space-y-1">
                    {categories.map((c) => (
                        <li key={c.name}>
                            <button
                                onClick={() => onSelectCategory(c.name)}
                                className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-all flex items-center gap-3 ${selectedCategory === c.name
                                    ? "bg-farm-deep text-white shadow-sm"
                                    : "text-slate-600 hover:bg-farm-earth hover:text-farm-deep"
                                    }`}
                            >
                                <span className="text-lg">{c.icon}</span>
                                {c.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
