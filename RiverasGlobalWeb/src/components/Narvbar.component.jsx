
import cssNav from "../assets/css/index.module.css"
import {NavLink} from 'react-router-dom'

function Navbar() {
    return (
        <div className={cssNav.header}>
            <img src="../../public/img/logo.png" alt="Logo"/>
            <div className={cssNav.nav}>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/policies">Policies</NavLink>
                <NavLink to="/register">register</NavLink>
                <NavLink to="/GetAll">Users</NavLink>
            </div>
        </div>
    )
}

export default Navbar;