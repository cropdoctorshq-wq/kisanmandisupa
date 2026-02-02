import { useNavigate } from 'react-router-dom';

export default function InstallGuide() {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 bg-white z-[2000] flex flex-col font-['Poppins'] animate-scale-up">

            {/* Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100/50 bg-white/80 backdrop-blur-md sticky top-0">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 text-slate-400 hover:text-slate-600 active:scale-95 transition-transform"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="flex items-center gap-2">
                    <img src="/assets/kisanmandi.in logo.png" className="w-6 h-6 object-contain" alt="Logo" />
                    <span className="font-bold text-slate-800 text-sm">Install App</span>
                </div>
                <div className="w-8"></div> {/* Spacer for center alignment */}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
                <div className="max-w-md mx-auto space-y-12 pb-20">

                    {/* Hero Section */}
                    <div className="text-center mt-4">
                        <div className="w-24 h-24 bg-white rounded-[2rem] mx-auto flex items-center justify-center mb-6 shadow-xl shadow-green-900/5 ring-1 ring-slate-100">
                            <img src="/assets/kisanmandi.in logo.png" className="w-14 h-14 object-contain" alt="Kisan Mandi" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-3">Install Kisan Mandi</h1>
                        <p className="text-slate-500 font-medium leading-relaxed px-4 text-sm text-balance">
                            Get the native app experience. Updates instantly, works offline, and keeps you logged in.
                        </p>
                    </div>

                    {/* Steps Container */}
                    <div className="space-y-6">

                        {/* Step 1 */}
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-slate-300 pointer-events-none">1</div>
                            <div className="flex items-center gap-5 relative z-10">
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Tap 'Share'</h3>
                                    <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider">Browser Toolbar</p>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-slate-300 pointer-events-none">2</div>
                            <div className="flex items-center gap-5 relative z-10">
                                <div className="w-14 h-14 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center shrink-0">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Add to Home Screen</h3>
                                    <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider">Scroll Down Menu</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Close / Action */}
            <div className="p-6 bg-white border-t border-slate-100 sticky bottom-0">
                <button
                    onClick={() => navigate(-1)}
                    className="w-full bg-[#15803d] text-white font-bold py-4 rounded-xl hover:bg-[#14532D] transition-all shadow-lg shadow-green-900/20 active:scale-[0.98]"
                >
                    I've done it!
                </button>
            </div>
        </div>
    );
}
