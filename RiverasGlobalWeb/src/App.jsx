import { Routes, Route, useLocation } from 'react-router-dom'
import Login from './routes/Login.component.jsx'
import Home from './routes/Home.component.jsx'
import Navbar from './components/Narvbar.component.jsx'
import Policy from './routes/Policy.component.jsx'
import RequireAuth from './components/RequireAuth.component.jsx'
import ChangePassword from './routes/ChangePassword.component.jsx'
import VerifyEmail from './routes/VerifyEmail.component.jsx'
import RecoveryPassword from './routes/RecoveryPassword.component.jsx'

const navbarBanned = ["/login", "/changePassword", "/verifyEmail"]
function App() {
    const location = useLocation() // usamos el location para saber en que url esta
    return (
        <>
            {!navbarBanned.includes((location.pathname)) && <Navbar />} {/* Verificamos si no esta en el login para cargar la navbar*/}
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
                <Route path='/verifyEmail' element={<VerifyEmail/>}/>
                <Route path='/recovery-password/:resetToken' element={<RecoveryPassword/>}/>
            </Routes>
        </>
    )
}

export default App