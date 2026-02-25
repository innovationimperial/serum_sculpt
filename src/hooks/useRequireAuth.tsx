import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

export function useRequireAuth() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const requireAuth = (action: () => void) => {
        if (isAuthenticated) {
            action();
        } else {
            // Redirect to login with a redirect query param back to current page
            // We use state to pass the intent or callback if needed, but simple url return is easiest
            navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
        }
    };

    return { requireAuth };
}
