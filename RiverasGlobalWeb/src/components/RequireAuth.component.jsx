import { Children, useContext } from "react";
import { userContext } from "../context/userProvider.context";
import { Navigate } from "react-router-dom";



function RequireAuth({children}) {
    const {user} = useContext(userContext) // extraemos el contexto para poder revisar si esta logueado o no
    if(!user){
        return <Navigate to="/login" /> // si el usuario no esta logueado, lo mandamos al logun
    }

    return children // si esta logueado le permitimos entrar a las rutas hijas (Mas informacion en el App.jsx)
}

export default RequireAuth;