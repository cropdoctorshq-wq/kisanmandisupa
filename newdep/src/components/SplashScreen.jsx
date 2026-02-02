import React from 'react';

export default function SplashScreen() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white font-['Poppins']">
            <div className="flex flex-col items-center px-10 w-full max-w-sm">

                {/* Minimal Logo - No styling, no animations */}
                <div className="w-full mb-20">
                    <img
                        src="/assets/kisanmandi.in logo.png"
                        alt="Kisan Mandi Logo"
                        className="relative w-full max-w-[320px] h-auto object-contain"
                    />
                </div>

                {/* Farming Loader: Tractor Plowing the Field */}
                <div className="w-full relative py-6">
                    {/* The Path (Soil) */}
                    <div className="h-[2px] w-full bg-gray-100 rounded-full relative overflow-hidden">
                        {/* The Progress (Growing Grass/Crop) */}
                        <div className="absolute top-0 left-0 h-full bg-[#15803d] rounded-full animate-[loading_3s_ease-in-out_forwards]"></div>
                    </div>

                    {/* The Tractor - Moves along the line */}
                    <div className="absolute top-0 animate-tractor flex flex-col items-center -mt-1">
                        <span className="text-3xl filter grayscale-[0.2] scale-x-[-1]">🚜</span>
                        <div className="mt-8 flex flex-col items-center space-y-1">
                            <div className="flex gap-1">
                                <span className="text-[10px] font-bold text-[#15803d] tracking-widest uppercase">UNNATI</span>
                                <span className="text-[10px] font-bold text-[#15803d] animate-bounce">.</span>
                                <span className="text-[10px] font-bold text-[#15803d] animate-bounce [animation-delay:0.2s]">.</span>
                                <span className="text-[10px] font-bold text-[#15803d] animate-bounce [animation-delay:0.4s]">.</span>
                            </div>
                        </div>
                    </div>

                    {/* Stages indicators */}
                    <div className="flex justify-between mt-12 w-full opacity-30 px-1">
                        <span className="text-xs">🌱</span>
                        <span className="text-xs">🌿</span>
                        <span className="text-xs">🌾</span>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.5em]">
                        Empowering Indian Farmers
                    </p>
                </div>
            </div>
        </div>
    );
}
