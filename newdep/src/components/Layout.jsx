import { Outlet, useLocation } from 'react-router-dom';
import MobileBottomNav from './MobileBottomNav';

export default function Layout() {
    const location = useLocation();

    // Hide global nav on auth pages AND the main landing page ('/')
    // Dashboards rely on this global nav now (duplicate imports were removed)
    const hideGlobalNav = ['/login', '/signup-buyer', '/signup-farmer', '/register', '/welcome'].some(path => location.pathname.startsWith(path)) || location.pathname === '/';

    return (
        <>
            <Outlet />
            {!hideGlobalNav && <MobileBottomNav />}
        </>
    );
}
