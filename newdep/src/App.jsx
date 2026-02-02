import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Marketplace from './pages/Marketplace';
import SellerDashboard from './pages/SellerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import Login from './pages/auth/Login';
import SignupBuyer from './pages/auth/SignupBuyer';
import SignupFarmer from './pages/auth/SignupFarmer';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import SplashScreen from './components/SplashScreen';
import InstallGuide from './pages/InstallGuide';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Marketplace />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup-buyer" element={<SignupBuyer />} />
        <Route path="/signup-farmer" element={<SignupFarmer />} />
        <Route path="/install-guide" element={<InstallGuide />} />
      </Route>
    </Routes>
  );
}

export default App;
