import { useEffect } from "react"
import {useUser} from '../context/userProvider.context.jsx'
import {useNavigate} from 'react-router-dom'


function Home() {
    const {user} = useUser()

    const navigate = useNavigate()
    useEffect(() => {
        if(!user){
            navigate("/login")
        }
        else if(user.userFirstSession) {
            navigate("/changePassword")
        }
    }, [user, navigate])
    
    return (
        <h1>Home</h1>
    )
}

export default Home