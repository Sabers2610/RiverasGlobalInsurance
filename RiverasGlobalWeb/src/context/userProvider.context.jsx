import {createContext, useState, useContext} from 'react'

export const userContext = createContext()


export const useUser = () => { 
    const context = useContext(userContext)
    if(!context){
        throw new Error("useUse must be used within an userProvider")
    }
    return context
}
function UserProvider(props) {
    const [user, setUser] = useState(null) // Creamos un state que luego pasara al context donde almacenaremos el usuario
    const [isAuth, setIsAuth] = useState(false)

    return (
        <userContext.Provider value={{user, setUser, isAuth, setIsAuth}}>
            {props.children} 
        </userContext.Provider>
    )
}

export default UserProvider;