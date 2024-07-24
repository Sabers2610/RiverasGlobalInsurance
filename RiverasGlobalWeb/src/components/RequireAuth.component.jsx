import { useContext } from "react";
import { userContext } from "../context/userProvider.context.jsx";
import { Navigate } from "react-router-dom";

function RequireAuth({ children }) {
    const { user, isAuth } = useContext(userContext);

    if (!isAuth) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default RequireAuth;
