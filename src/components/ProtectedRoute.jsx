import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, requireAuth = true }) {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (requireAuth && !currentUser) {
        // Redirect to login with return path
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
}
