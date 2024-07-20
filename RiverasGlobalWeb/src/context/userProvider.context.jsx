import {createContext, useState} from 'react'

export const userContext = createContext()

function UserProvider(props) {
    const [user, setUser] = useState(null) // Creamos un state que luego pasara al context donde almacenaremos el usuario

    return (
        <userContext.Provider value={{user, setUser}}>
            {props.children} 
        </userContext.Provider>
    )
}

export default UserProvider;