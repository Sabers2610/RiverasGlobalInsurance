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
    })
    const [formErrors, setFormErrors] = useState({
        message: "The entered email is not valid. Please enter a valid email, e.g., user@gmail.com.",
        activate: false,
        sessionError: false
    })
    const { setUser } = useContext(userContext)
    const navigate = useNavigate()

    const handleChange = (event) => {
        const { name, value } = event.target

        setFormData({
            ...formData,
            [name]: value
        })
        // validamos los campos
        switch(name) {
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
        }
    }

    const login = async (event) => {
        try {
            event.preventDefault();

            if(formData.email === "") {
                setFormErrors({...formErrors, activate: true})
            }
            else if(!validator.isEmail(formData.email)) {
                setFormErrors({...formErrors, activate: true})
            }

            if(!formErrors.activate) {
                const data = await loginServices(formData.email, formData.password)
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
                    setUser(data)
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