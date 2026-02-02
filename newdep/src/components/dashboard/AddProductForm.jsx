import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { resizeImage } from '../../utils/imageUtils';

export default function AddProductForm({ onProductAdded, editingProduct, onCancelEdit }) {
    const { user, userData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([null, null, null]);
    const fileInputs = useRef([]);

    // Reset form when editingProduct changes
    useEffect(() => {
        if (editingProduct) {
            // Populate images
            const newImages = [null, null, null];
            if (editingProduct.images) {
                editingProduct.images.forEach((img, i) => { if (i < 3) newImages[i] = img; });
            } else if (editingProduct.image) {
                newImages[0] = editingProduct.image;
            }
            setImages(newImages);

            // Populate text fields via defaultValues mechanism in React Hook Form would be better but standard form works
            document.getElementById('pName').value = editingProduct.name;
            document.getElementById('pPrice').value = editingProduct.price;
            document.getElementById('pUnit').value = editingProduct.unit;
            document.getElementById('pCategory').value = editingProduct.category || "";
            document.getElementById('pDescription').value = editingProduct.description || "";
        } else {
            document.getElementById('addProductForm')?.reset();
            setImages([null, null, null]);
        }
    }, [editingProduct]);

    const handleImageSelect = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const resized = await resizeImage(file);
            const newImages = [...images];
            newImages[index] = resized;
            setImages(newImages);
        } catch (err) {
            alert("Failed to process image");
        }
    };

    const clearImage = (index) => {
        const newImages = [...images];
        newImages[index] = null;
        setImages(newImages);
        if (fileInputs.current[index]) fileInputs.current[index].value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        const finalImages = images.filter(img => img !== null);
        if (finalImages.length === 0) {
            alert("Please upload at least one photo (Photo 1).");
            return;
        }

        setLoading(true);
        try {
            const prodData = {
                seller_uid: user.id,
                seller_name: userData.name || 'Unknown Farmer',
                seller_loc: (userData.city || '') + (userData.state ? ', ' + userData.state : ''),
                seller_image: userData.profileImage || null,
                name: e.target.elements.pName.value,
                price: e.target.elements.pPrice.value,
                unit: e.target.elements.pUnit.value,
                category: e.target.elements.pCategory.value,
                description: e.target.elements.pDescription.value,
                images: finalImages,
                image: finalImages[0]
            };

            if (editingProduct) {
                const { error } = await supabase
                    .from('products')
                    .update(prodData)
                    .eq('id', editingProduct.id);

                if (error) throw error;
                alert("Product Updated Successfully!");
                onCancelEdit();
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([prodData]);

                if (error) throw error;
                alert("Harvest Listed Successfully!");
            }

            e.target.reset();
            setImages([null, null, null]);
            if (onProductAdded) onProductAdded();
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E6DF] shadow-sm max-w-2xl">
            <h2 className="text-xl font-bold text-[#15803d] mb-1">{editingProduct ? "Edit Harvest" : "List New Harvest"}</h2>
            <p className="text-xs text-gray-500 mb-6">{editingProduct ? "Update details" : "Add details about your crop."}</p>

            <form id="addProductForm" onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Crop Name *</label>
                    <input type="text" id="pName" name="pName" required placeholder="e.g. Red Onions" className="w-full bg-[#F3F6F4] border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (₹) *</label>
                    <div className="flex gap-4">
                        <input type="number" id="pPrice" name="pPrice" required placeholder="50" className="w-1/2 bg-[#F3F6F4] border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-green-500" />
                        <select id="pUnit" name="pUnit" className="w-1/2 bg-[#F3F6F4] border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-green-500">
                            <option value="kg">/ kg</option>
                            <option value="quintal">/ quintal</option>
                            <option value="dozen">/ dozen</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category *</label>
                    <select id="pCategory" name="pCategory" required className="w-full bg-[#F3F6F4] border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-green-500">
                        <option value="" disabled selected>Select Category</option>
                        {["Vegetables", "Fruits", "Grains", "Pulses", "Spices", "Dairy", "Seeds", "Manure", "Pesticides", "Others"].map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                    <textarea id="pDescription" name="pDescription" placeholder="Tell buyers about your harvest..." className="w-full bg-[#F3F6F4] border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-green-500 h-24 resize-none"></textarea>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Photos (Max 3) *</label>
                    <div className="grid grid-cols-3 gap-3">
                        {[0, 1, 2].map((idx) => (
                            <div key={idx} className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden bg-white" onClick={() => fileInputs.current[idx]?.click()}>
                                <input
                                    type="file"
                                    ref={el => fileInputs.current[idx] = el}
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleImageSelect(e, idx)}
                                />
                                {images[idx] ? (
                                    <>
                                        <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${images[idx]}')` }}></div>
                                        <button type="button" onClick={(e) => { e.stopPropagation(); clearImage(idx); }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md z-10 hover:bg-red-600 transition-transform hover:scale-110">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center p-2 pointer-events-none">
                                        <span className="text-2xl block mb-1">📸</span>
                                        <span className="text-[10px] font-bold text-gray-400 leading-tight">
                                            {idx === 0 ? "Main Photo" : "Option"} <br />
                                            {idx === 0 && <span className="text-red-500">(Required)</span>}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="pt-2 flex gap-3">
                    {editingProduct && (
                        <button type="button" onClick={onCancelEdit} className="w-1/3 bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-300 transition">Cancel</button>
                    )}
                    <button type="submit" disabled={loading} className={`flex-1 bg-[#F59E0B] text-[#3E2408] font-bold py-3.5 rounded-xl shadow-lg shadow-orange-900/10 hover:bg-[#D97706] transition ${loading ? 'opacity-70' : ''}`}>
                        {loading ? (editingProduct ? "Updating..." : "Publishing...") : (editingProduct ? "Update Listing" : "Publish Listing")}
                    </button>
                </div>
            </form>
        </div>
    );
}
