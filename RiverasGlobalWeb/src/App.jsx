import { Routes, Route, useLocation } from 'react-router-dom'
import Login from './routes/Login.component.jsx'
import Home from './routes/Home.component.jsx'
import Navbar from './components/Narvbar.component.jsx'
import Policy from './routes/Policy.component.jsx'
import RequireAuth from './components/RequireAuth.component.jsx'
import ChangePassword from './routes/ChangePassword.component.jsx'

function App() {
    const location = useLocation() // usamos el location para saber en que url esta
    return (
        <>
            {location.pathname !== "/login" && <Navbar />} {/* Verificamos si no esta en el login para cargar la navbar*/}
            <Routes>
                <Route path='/' element={
                    <RequireAuth>
                        <Home /> {/* Creamos la ruta de home y le seteamos el require auth para que deba estar logueado*/}
                    </RequireAuth>
                } />
                
                <Route path='/changePassword' element={
                    <RequireAuth>
                        <ChangePassword/>
                    </RequireAuth>
                }/>

                <Route path='/login' element={<Login />} />
                <Route path='/policies' element={<Policy />} />
            </Routes>
        </>
    )
}

export default App