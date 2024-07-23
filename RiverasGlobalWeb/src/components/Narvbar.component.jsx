
import "../../public/assets/css/index.css"
import {NavLink} from 'react-router-dom'

function Navbar() {
    return (
        <div className="header">
            <img src="/assets/img/logo.png" alt="Logo"/>
            <div className="nav">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/policies">Policies</NavLink>
                <NavLink to="/register">register</NavLink>
            </div>
        </div>
    )
}

export default Navbar;