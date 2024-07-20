import {Routes, Route, useLocation} from 'react-router-dom'
import Login from './routes/Login.component.jsx'
import Home from './routes/Home.component.jsx'
import Navbar from './components/Narvbar.component.jsx'
import Policy from './routes/Policy.component.jsx'
import Register from './routes/Register.component.jsx'
import RequireAuth from './components/RequireAuth.component.jsx'


function App() {
  const location = useLocation()
  return (
    <>
      {location.pathname !== "/login" && <Navbar/>}
      <Routes>
        <Route path='/' element={
          <RequireAuth>
            <Home/>
          </RequireAuth>
        } />
        <Route path='/login' element={<Login />} />
        <Route path='/policies' element={<Policy/>} />
        <Route path='/register' element={<Register/>} />
      </Routes>
    </>
  )
}

export default App