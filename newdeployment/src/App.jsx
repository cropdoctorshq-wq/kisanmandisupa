import { Routes, Route } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import Layout from './components/Layout';
import SplashScreen from './components/SplashScreen';
import PageLoader from './components/PageLoader';

const Landing = lazy(() => import('./pages/Landing'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const SellerDashboard = lazy(() => import('./pages/SellerDashboard'));
const BuyerDashboard = lazy(() => import('./pages/BuyerDashboard'));
const Login = lazy(() => import('./pages/auth/Login'));
const SignupBuyer = lazy(() => import('./pages/auth/SignupBuyer'));
const SignupFarmer = lazy(() => import('./pages/auth/SignupFarmer'));
const InstallGuide = lazy(() => import('./pages/InstallGuide'));
const EnquiryPage = lazy(() => import('./pages/EnquiryPage'));

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
    <Suspense fallback={<PageLoader />}>
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
          <Route path="/enquiry" element={<EnquiryPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
