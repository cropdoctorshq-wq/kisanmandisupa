import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        // Emergency timeout to prevent infinite loading
        const emergencyTimeout = setTimeout(() => {
            if (mounted && loading) {
                console.warn("Auth: Emergency timeout triggered - Force clearing loading state");
                setLoading(false);
            }
        }, 8000);

        // Fetch User Data Function
        const fetchUserData = async (userId) => {
            if (!userId) return;
            console.log("Auth: Fetching user profile from DB for:", userId);
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (error) {
                    if (error.code === 'PGRST116') {
                        console.warn("Auth: User profile not found in 'users' table.");
                    } else {
                        console.error("Auth: Error fetching user profile:", error);
                    }
                } else if (mounted) {
                    console.log("Auth: User profile loaded successfully from DB.");
                    // Only update if data exists, avoiding resetting userData to null if we have fallback meta
                    if (data) setUserData(data);
                }
            } catch (error) {
                console.error("Auth: Catching error in fetchUserData:", error);
            }
        };

        // Initialize Session Function
        const initSession = async () => {
            console.log("Auth: Initializing session...");
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                if (session?.user) {
                    console.log("Auth: Session found for user:", session.user.id);
                    setUser(session.user);

                    // Priority 1: Instant Fallback from metadata
                    const meta = session.user.user_metadata || {};
                    setUserData({
                        id: session.user.id,
                        email: session.user.email,
                        name: meta.name || '',
                        phone: meta.phone || '',
                        role: meta.role || '',
                        city: meta.city || '',
                        state: meta.state || '',
                        pincode: meta.pincode || '',
                        profileImage: meta.profileImage || null
                    });

                    // Priority 2: Background Fetch from DB
                    fetchUserData(session.user.id);
                } else {
                    console.log("Auth: No active session.");
                    setUser(null);
                    setUserData(null);
                }
            } catch (err) {
                console.error("Auth: Session initialization failed:", err);
            } finally {
                if (mounted) {
                    setLoading(false);
                    clearTimeout(emergencyTimeout);
                }
            }
        };

        initSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth: State change event:", event);
            if (!mounted) return;

            if (session?.user) {
                setUser(session.user);

                // Immediate fallback to metadata
                const meta = session.user.user_metadata || {};
                setUserData({
                    id: session.user.id,
                    email: session.user.email,
                    name: meta.name || '',
                    phone: meta.phone || '',
                    role: meta.role || '',
                    city: meta.city || '',
                    state: meta.state || '',
                    pincode: meta.pincode || '',
                    profileImage: meta.profileImage || null
                });

                // Background fetch fresh DB data
                fetchUserData(session.user.id);
            } else {
                setUser(null);
                setUserData(null);
            }
            setLoading(false);
        });

        return () => {
            mounted = false;
            subscription?.unsubscribe();
            clearTimeout(emergencyTimeout);
        };
    }, []);

    const refreshUserData = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setUserData(data);
                console.log("Auth: Profile refreshed manually.");
            }
        } catch (err) {
            console.error("Auth: Manual refresh failed", err);
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUserData(null);
        setUser(null);
    };

    const value = {
        user,
        userData,
        loading,
        logout,
        refreshUserData
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
