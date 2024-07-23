import { useContext } from "react"
import { userContext } from "../context/userProvider.context"


function Home() {
    const {user} = useContext(userContext)

    return (
        <h1>Home</h1>
    )
}

export default Home