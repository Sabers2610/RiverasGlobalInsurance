import cssNav from "../assets/css/index.module.css"
import {NavLink} from 'react-router-dom'
import { logoutServices } from "../services/session.services"
import { useNavigate } from "react-router-dom";
import {useUser} from '../context/userProvider.context.jsx'

function Navbar() {
    const { user, setUser, setIsAuth } = useUser() // extraemos el contexto para poder hacer logout (cerrar sesion)
    const navigate = useNavigate() // Creamos el navigate para poder redireccionar a los usuarios
    const handleLogout = async () => {
        const response = await logoutServices(user.userToken.token); // llamamos el servicio para hacer logout desde la api

        if(response.status === 200){
            await setUser(null)
            await setIsAuth(false)
            navigate("/login") // al cerrar sesion lo mandamos al login
        }
        
    }
    return (
        <div className={cssNav.header}>
            <img src="/img/logo.png" alt="Logo"/>
            <div className={cssNav.nav}>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/policies">Policies</NavLink>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}

export default Navbar;