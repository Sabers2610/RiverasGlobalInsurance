import { useContext, useState } from "react";
import "../../public/assets/css/login.css"
import { loginServices } from "../services/session.services";
import { userContext } from "../context/userProvider.context";
import { useNavigate } from "react-router-dom";
import validator from "validator"
import { AxiosError } from "axios";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    }) // creamos los campos del formulario como un estado de react para poder almacenar lo que ingrese el usuario

    const [formErrors, setFormErrors] = useState({
        message: "The entered email is not valid. Please enter a valid email, e.g., user@gmail.com.",
        activate: false,
        sessionError: false
    }) // creamos los errores para el formulario, tambien como un state de react

    const { setUser } = useContext(userContext) // sacamos el setuser del context para poder registrar al usuario una vez se loguee
    const navigate = useNavigate()

    const handleChange = (event) => {
        const { name, value } = event.target

        setFormData({
            ...formData,
            [name]: value
        }) // lo que hacemos con el operador de propagacion "..." es que cree nuevamente el objeto, cambiando lo que ingreso el usuario
        // pero sin borrar lo que ya este generado en otros campos

        // validamos los campos
        switch(name) { // el switch es un multi if, cada case es un if que se evalua en la variable que pasaste en el switch, como el name
            case "email":
                if(validator.isEmpty(value)){
                    setFormErrors({...formErrors, activate: true})
                }
                else if(!validator.isEmail(value)){
                    setFormErrors({...formErrors, activate: true})
                }
                else {
                    setFormErrors({...formErrors, activate: false})
                }
                break
            default:
                break
        }
    }

    const login = async (event) => {
        try {
            event.preventDefault(); // cancelamos el evento predeterminado del formulario para que no recargue la pagina

            if(formData.email === "") {
                setFormErrors({...formErrors, activate: true})
            }
            else if(!validator.isEmail(formData.email)) {
                setFormErrors({...formErrors, activate: true})
            }

            if(!formErrors.activate) {
                const data = await loginServices(formData.email, formData.password) // llamamos al servicio y capturamos los posibles errores
                if(data instanceof AxiosError){
                    if(data.response.status === 500){
                        setFormErrors({
                            message: "Server internal error... please contact support", 
                            activate: true,
                            sessionError: true
                        })
                    }
                    else if(data.response.status === 401){
                        setFormErrors({
                            message: "Email and/or password incorrect", 
                            activate: true,
                            sessionError: true
                        })
                    }
                }
                else{
                    setUser(data) // si el servicio respondio bien, registramos al usuario dentro del context y lo mandamos al home
                    return navigate("/")
                }
            }
        } catch (error) {
            console.log("ERROR")
            console.log(error)
        }
    }


    return (
        <div className="login-container">
            <img src="/assets/img/logo.png" alt="Logo" />
            <form id="loginForm" onSubmit={login}>
            <input type="text" name="email" style={formErrors.activate ? {border: "1px solid #fe0202"} : {}} id="username" placeholder="usuario@gmail.com" value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" style={formErrors.sessionError ? {border: "1px solid #fe0202"} : {}} id="password" placeholder="password" value={formData.password} onChange={handleChange} required />

                {formErrors.activate && (
                    <p style={{color: "red"}}>{formErrors.message}</p>
                )}
                <button type="submit">Enter</button>
                <a href="#">¿Problems with your password?</a>
            </form>
        </div>
    )
}

export default Login