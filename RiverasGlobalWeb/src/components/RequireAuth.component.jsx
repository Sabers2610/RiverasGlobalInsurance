import { Children, useContext } from "react";
import { userContext } from "../context/userProvider.context";
import { Navigate } from "react-router-dom";



function RequireAuth({children}) {
    const {user} = useContext(userContext)
    if(!user){
        return <Navigate to="/login" />
    }

    return children
}

export default RequireAuth;