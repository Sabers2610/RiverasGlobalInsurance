import modifyCss from '../assets/css/index.module.css'
import {NavLink} from 'react-router-dom'
import { logoutServices } from "../services/session.services"
import { useNavigate } from "react-router-dom";
import { userContext } from "../context/userProvider.context";
import { useContext } from "react";

function Navbar() {
    const { user, setUser } = useContext(userContext)
    const navigate = useNavigate()
    const handleLogout = async () => {
        const response = await logoutServices(user.userToken);

        if(response.status === 200){
            setUser(null)
        }
        return navigate("/login")
    }
    return (
        <div className={modifyCss.header}>
            <img src="/img/logo.png" alt="Logo"/>
            <div className={modifyCss.nav}>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/policies">Policies</NavLink>
                <NavLink to="/modifyUser">modifyUser</NavLink>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}

export default Navbar;