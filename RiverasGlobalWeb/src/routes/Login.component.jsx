import { useEffect, useState } from "react";
import cssLogin from "../assets/css/login.module.css";
import {useUser} from '../context/userProvider.context.jsx'
import {isEmpty, isEmail} from 'validator'
import sessionServices from "../services/session.services.js";
import {useNavigate, NavLink} from 'react-router-dom'

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [errors, setErrors] = useState({})
    const {setUser, isAuth, setIsAuth} = useUser()
    const navigate = useNavigate()

    useEffect(() => {
        if(isAuth){
            return navigate("/")
        }
    }, [isAuth])

    const handleChange = (event) => { 
        const {name, value} = event.target

        setFormData({...formData, [name]: value})
    }

    const onValidate = () => {
        let isErrors = false
        
        if(isEmpty(formData.email) || !isEmail(formData.email)){
            setErrors({email: "The email you entered is not in a valid format. Please enter a valid email address, such as user@example.com."})
            isErrors = true
        }

        return isErrors 
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validate = onValidate();

        if(!validate){
            const response = await sessionServices.loginServices(formData.email, formData.password)
            //console.log(response.success)
            if(!response.success) {
                if(response.status === 401 || response.status === 400){
                    setErrors({loginError: "Email and/or password incorrect"})
                }
                else {
                    setErrors({loginError: response.message})
                }
                
            }
            else {
                setUser(response)
                setIsAuth(true)
                navigate("/")
            }
        }
    }

    return (
        <div className={cssLogin.loginContainer}>
            <img src="/img/logo.png" alt="Logo" />
            <form id="loginForm" onSubmit={handleSubmit}>
                <label>Email:</label>
                <input
                    type="text"
                    name="email"
                    style={errors.email || errors.loginError ? { border: "1px solid #fe0202" } : {}}
                    id="username"
                    placeholder="usuario@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                {errors.email && (
                    <p style={{ color: "red" }}>{errors.email}</p>
                )}
                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    style={errors.loginError ? { border: "1px solid #fe0202" } : {}}
                    id="password"
                    placeholder="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                {errors.loginError  && (
                    <p style={{ color: "red" }}>{errors.loginError}</p>
                )}
                <button type="submit">Enter</button>
                <NavLink to="/verifyEmail">¿Problems with your password?</NavLink>
            </form>
        </div>
    );
}

export default Login;
