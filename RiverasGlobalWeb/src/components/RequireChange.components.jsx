import { useContext } from "react";
import { userContext } from "../context/userProvider.context";
import { Navigate } from "react-router-dom";

function RequireChange({children}){
    const {user} = useContext(userContext) // extraemos el contexto para poder revisar si esta logueado o no
    if(!user){
        return <Navigate to="/login" /> // si el usuario no esta logueado, lo mandamos al logun
    }
    else if(!user.userFirstSession){
        console.log(user.userFirstSession)
        console.log(user.userPasswordChanged)
        return <Navigate to="/"/>
    }

    return children
}

export default RequireChange