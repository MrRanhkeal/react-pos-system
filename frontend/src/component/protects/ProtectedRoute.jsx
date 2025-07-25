
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
// import { getPermission } from "../store/profile.store";
import { getPermission } from "../../store/profile.store";

// Usage: <ProtectedRoute permissionKey="user" element={<UserPage />} />
export default function ProtectedRoute({ permissionKey, element }) {
    const permission = getPermission();

    // Admin can access everything
    if (permission?.all) return element;

    // If the permissionKey is found in permission object, allow
    if (permission && permission[permissionKey]) return element;

    // Otherwise, block access
    return <Navigate to="/" replace />;
}

ProtectedRoute.propTypes = {
    permissionKey: PropTypes.string.isRequired,
    element: PropTypes.node.isRequired,
};