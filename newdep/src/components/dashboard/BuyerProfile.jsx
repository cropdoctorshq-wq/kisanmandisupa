import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function BuyerProfile() {
    const { user, userData, logout, refreshUserData } = useAuth();
    const [loading, setLoading] = useState(false);

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
                pincode: form.elements.pincode.value
            };

            const { error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', user.id);

            if (error) throw error;

            await refreshUserData();
            alert("Profile Updated Successfully!");
        } catch (error) {
            alert("Error updating profile: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-[1.5rem] p-8 border border-gray-100 shadow-sm max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
                <div className="relative group">
                    <img
                        src={userData?.profileImage || "https://ui-avatars.com/api/?name=" + (userData?.name || "User") + "&background=random"}
                        className="w-20 h-20 rounded-full object-cover border-4 border-green-50"
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            try {
                                // Compress Image Logic
                                const compressImage = (file) => new Promise((resolve, reject) => {
                                    const reader = new FileReader();
                                    reader.readAsDataURL(file);
                                    reader.onload = (event) => {
                                        const img = new Image();
                                        img.src = event.target.result;
                                        img.onload = () => {
                                            const canvas = document.createElement('canvas');
                                            const MAX_WIDTH = 500;
                                            const scaleSize = MAX_WIDTH / img.width;
                                            canvas.width = MAX_WIDTH;
                                            canvas.height = img.height * scaleSize;

                                            const ctx = canvas.getContext('2d');
                                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                                            resolve(canvas.toDataURL('image/jpeg', 0.6)); // Compress to JPEG 60%
                                        };
                                        img.onerror = (err) => reject(err);
                                    };
                                    reader.onerror = (err) => reject(err);
                                });

                                const compressedBase64 = await compressImage(file);

                                const { error } = await supabase
                                    .from('users')
                                    .update({ profileImage: compressedBase64 })
                                    .eq('id', user.id);

                                if (error) throw error;

                                await refreshUserData();
                            } catch (err) {
                                console.error(err);
                                alert("Failed to update image. Try a smaller file.");
                            }
                        }} />
                    </label>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Your Profile</h2>
                    <p className="text-sm text-gray-500">Manage your personal information.</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Full Name</label>
                    <input type="text" name="name" defaultValue={userData?.name} placeholder="Full Name" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-green-500 transition" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Phone</label>
                    <input type="tel" name="phone" defaultValue={userData?.phone} placeholder="Phone" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-green-500 transition" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">City/Village</label>
                    <input type="text" name="city" defaultValue={userData?.city} placeholder="City" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-green-500 transition" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">State</label>
                    <input type="text" name="state" defaultValue={userData?.state} placeholder="State" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-green-500 transition" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Pincode</label>
                    <input type="text" name="pincode" defaultValue={userData?.pincode} placeholder="Pincode" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-green-500 transition" />
                </div>

                <div className="col-span-full mt-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <button type="submit" disabled={loading} className="w-full md:w-auto bg-gray-900 text-white px-8 py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-70">
                        {loading ? "Saving..." : "Save Changes"}
                    </button>

                    <button type="button" onClick={logout} className="lg:hidden w-full md:w-auto text-red-500 bg-red-50 px-8 py-3.5 rounded-xl text-sm font-bold transition-all border border-red-100 hover:bg-red-100 flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Sign Out
                    </button>
                </div>
            </form>
        </div>
    );
}
