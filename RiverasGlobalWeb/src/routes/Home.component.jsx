import { useContext } from "react"
import { userContext } from "../context/userProvider.context"


function Home() {
    const {user} = useContext(userContext)

    console.log("Se imprimira al usuario del context en el home...")
    console.log(user)
    return (
        <h1>Home</h1>
    )
}

export default Home