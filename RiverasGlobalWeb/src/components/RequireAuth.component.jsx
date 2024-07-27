import { useUser } from '../context/userProvider.context.jsx'
import { Navigate, useNavigate } from "react-router-dom";
import sessionServices from "../services/session.services.js";
import { useEffect, useState } from 'react';


function RequireAuth({ children }) {
    const { setUser, setIsAuth, isAuth } = useUser();
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const autoLogin = async () => {
            try {
                const response = await sessionServices.refreshTokenServices();
                if (!response.success) {
                    return navigate("/login");
                }

                const response2 = await sessionServices.autoLoginServices(response.token);
                if (!response2.success) {
                    return navigate("/login");
                }

                const { success, ...userData } = response2;
                setUser(userData);
                setIsAuth(true);
            } catch (error) {
                console.error('Error during authentication', error);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        autoLogin();
    }, [navigate, setUser, setIsAuth]);

    if(loading){
        return <p>loading...</p>
    }
    return children;
}

export default RequireAuth;
