import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const isPublicRoute = location.pathname.startsWith("/shop") || 
                      location.pathname === "/" ||
                      location.pathname === "/privacy-policy" ||
                      location.pathname === "/terms-of-service" ||
                      location.pathname === "/about" ||
                      location.pathname === "/contact";

  // Handle root path
  if (location.pathname === "/") {
    return <Navigate to="/shop/home" replace />;
  }

  // Redirect to login for protected routes if not authenticated
  if (
    !isAuthenticated &&
    !isPublicRoute &&
    !location.pathname.startsWith("/auth/") &&
    !location.pathname.startsWith("/forgot-password") &&
    !location.pathname.startsWith("/reset-password") &&
    !location.pathname.startsWith("/activate")
  ) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Redirect authenticated users away from auth pages
  if (
    isAuthenticated &&
    (location.pathname.startsWith("/auth/") ||
      location.pathname === "/login" ||
      location.pathname === "/register")
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/shop/home" replace />;
    }
  }

  // Prevent non-admin users from accessing admin routes
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.startsWith("/admin")
  ) {
    return <Navigate to="/unauth-page" replace />;
  }

  // Prevent admin users from accessing regular user account pages
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    (location.pathname.startsWith("/shop/account") ||
     location.pathname.startsWith("/shop/checkout") ||
     location.pathname.startsWith("/shop/paypal-return") ||
     location.pathname.startsWith("/shop/payment-success"))
  ) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}

export default CheckAuth;
