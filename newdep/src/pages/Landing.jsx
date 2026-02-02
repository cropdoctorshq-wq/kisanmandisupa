import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

export default function Landing() {
    const { user, userData, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user && userData) {
            console.log("Landing: User is already logged in, redirecting based on role:", userData.role);
            if (userData.role === 'buyer') {
                navigate('/home');
            } else if (userData.role === 'farmer' || userData.role === 'seller') {
                navigate('/seller-dashboard');
            }
        }
    }, [user, userData, loading, navigate]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 lg:p-8 font-['Poppins'] bg-[#F8F9FA]" style={{ backgroundImage: "radial-gradient(#E9ECEF 1px, transparent 1px)", backgroundSize: "24px 24px" }}>

            <main className="w-full max-w-7xl relative mx-auto flex items-center justify-center animate-[fadeInUp_1s_ease-out_forwards] py-8 lg:py-0 lg:h-[750px]">
                <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-2xl shadow-black/5 overflow-hidden w-full flex flex-col lg:flex-row relative z-10">

                    {/* Left Section: Content */}
                    <div className="w-full lg:w-1/2 p-6 lg:p-16 flex flex-col justify-center order-2 lg:order-1 relative">

                        {/* Logo Area */}
                        <div className="mb-8 lg:mb-12 flex items-center gap-3">
                            <img src="/assets/kisanmandi.in logo.png" alt="kisanmandi.in Logo" className="h-10 lg:h-14 object-contain" />
                        </div>

                        <div className="mt-2 lg:mt-0">
                            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 mb-4 lg:mb-6 leading-[1.1] tracking-tight">
                                Get Fresh <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#15803d] to-yellow-500">Organic Products</span> <br />
                                Direct from <span className="text-[#15803d]">Farmers.</span>
                            </h1>

                            <p className="hidden lg:block text-gray-500 text-sm lg:text-base mb-8 leading-relaxed max-w-lg font-medium">
                                Connect directly with verified farmers. Experience the taste of genuine harvest while empowering local agriculture.
                            </p>

                            {/* Action Buttons */}
                            <div className="space-y-4 max-w-sm">
                                <Link to="/login" className="group relative flex items-center justify-center w-full bg-[#15803d] hover:bg-[#14532D] text-white text-base lg:text-lg font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-[#15803d]/20 hover:shadow-[#15803d]/30 hover:-translate-y-0.5 overflow-hidden">
                                    <span className="relative z-10 flex items-center gap-2">
                                        Login to Account
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </span>
                                </Link>

                                <div className="relative py-3 flex items-center">
                                    <div className="flex-grow border-t border-gray-200"></div>
                                    <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">Get Started</span>
                                    <div className="flex-grow border-t border-gray-200"></div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Link to="/signup-farmer" className="group flex flex-row items-center justify-center gap-2 bg-white hover:bg-[#15803d]/5 text-gray-700 hover:text-[#15803d] font-bold py-3.5 rounded-xl border border-gray-200 hover:border-[#15803d]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#15803d]/5">
                                        <span className="text-lg group-hover:scale-110 transition-transform duration-300">🚜</span>
                                        <span className="text-sm">Farmer</span>
                                    </Link>
                                    <Link to="/signup-buyer" className="group flex flex-row items-center justify-center gap-2 bg-white hover:bg-yellow-50 text-gray-700 hover:text-yellow-600 font-bold py-3.5 rounded-xl border border-gray-200 hover:border-yellow-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-yellow-500/10">
                                        <span className="text-lg group-hover:scale-110 transition-transform duration-300">🥬</span>
                                        <span className="text-sm">Buyer</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Visual */}
                    <div className="w-full lg:w-1/2 relative order-1 lg:order-2 h-64 lg:h-auto min-h-[300px] lg:min-h-full">
                        <div className="absolute inset-0">
                            <img
                                src="/assets/landing_hero_new.png"
                                alt="Farmer and Buyer Connection"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden"></div>
                        </div>
                    </div>

                </div>
            </main >
        </div >
    );
}
