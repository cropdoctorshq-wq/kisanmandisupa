import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { resizeImage } from '../../utils/imageUtils';

export default function SellerProfile() {
    const { user, userData, logout, refreshUserData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState('/assets/farmer_avatar_new.png');
    const fileInput = useRef(null);

    useEffect(() => {
        if (userData?.profileImage) {
            setProfileImage(userData.profileImage);
        }
    }, [userData]);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const resized = await resizeImage(file);
            setProfileImage(resized);
        } catch (err) {
            alert("Failed to process image");
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        const form = e.target;

        try {
            const updates = {
                name: form.elements.name.value,
                phone: form.elements.phone.value,
                city: form.elements.city.value,
                state: form.elements.state.value,
                pincode: form.elements.pincode.value,
                profileImage: profileImage // Consistent with AuthContext
            };

            // Update in Supabase
            const { error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', user.id);

            if (error) throw error;

            // Update local context silently
            await refreshUserData();

            alert("Profile Updated Successfully!");
        } catch (error) {
            alert("Error updating profile: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E6DF] shadow-sm max-w-2xl">
            <h2 className="text-xl font-bold text-[#15803d] mb-6">Farmer Profile</h2>
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Profile Image Upload */}
                <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-4 border-2 border-dashed border-green-200 rounded-xl bg-green-50/50 hover:bg-green-50 transition-colors cursor-pointer group relative"
                    onClick={() => fileInput.current?.click()}>
                    <input type="file" ref={fileInput} className="hidden" accept="image/*" onChange={handleImageChange} />
                    <div className="relative h-24 w-24 mb-2">
                        <img src={profileImage} className="h-full w-full rounded-full object-cover border-2 border-white shadow-md" alt="Profile" />
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-xs font-bold text-[#15803d]">Tap to change profile photo</p>
                </div>

                <input type="text" name="name" defaultValue={userData?.name} placeholder="Full Name" className="bg-[#F3F6F4] border-none rounded-xl px-4 py-3 text-sm font-bold" />

                <div className="relative">
                    <input type="text" value={user?.email || ""} readOnly className="w-full bg-gray-100 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-500 cursor-not-allowed" />
                    <span className="absolute right-4 top-3 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">VERIFIED</span>
                </div>

                <input type="tel" name="phone" defaultValue={userData?.phone} placeholder="Phone" className="bg-[#F3F6F4] border-none rounded-xl px-4 py-3 text-sm font-bold" />
                <input type="text" name="city" defaultValue={userData?.city} placeholder="City / Village" className="bg-[#F3F6F4] border-none rounded-xl px-4 py-3 text-sm font-bold" />
                <input type="text" name="state" defaultValue={userData?.state} placeholder="State" className="bg-[#F3F6F4] border-none rounded-xl px-4 py-3 text-sm font-bold" />
                <input type="text" name="pincode" defaultValue={userData?.pincode} placeholder="Pincode" className="bg-[#F3F6F4] border-none rounded-xl px-4 py-3 text-sm font-bold" />

                <div className="col-span-1 md:col-span-2 mt-4">
                    <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-[10px] font-bold text-blue-500 uppercase mb-1">Need Help?</p>
                        <p className="text-xs font-bold text-blue-800">Contact Support: <a href="mailto:dev.sahil@kissanmandi.com" className="underline">dev.sahil@kissanmandi.com</a></p>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-[#15803d] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#143D24] transition shadow-lg disabled:opacity-70">
                        {loading ? "Saving..." : "Save Changes"}
                    </button>

                    <button type="button" onClick={logout} className="lg:hidden w-full mt-4 bg-red-50 text-red-600 px-6 py-3 rounded-xl text-sm font-bold hover:bg-red-100 transition border border-red-100 flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Logout from Account
                    </button>
                </div>
            </form>
        </div>
    );
}
