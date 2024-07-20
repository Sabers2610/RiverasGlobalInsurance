import { useContext } from "react"
import { userContext } from "../context/userProvider.context"


function Home() {
    const {user} = useContext(userContext) // llmamos el contexto para acceder a los datos del usuario

    return (
        <h1>Home</h1>
    )
}

export default Home