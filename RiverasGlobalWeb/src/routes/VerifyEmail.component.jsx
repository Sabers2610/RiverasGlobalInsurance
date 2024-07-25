import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {useUser} from '../context/userProvider.context.jsx'
import {isEmail} from 'validator'
import { verifyEmailServices } from "../services/session.services.js";
import cssLogin from '../assets/css/login.module.css'


function VerifyEmail() {
    const [formData, setformData] = useState({
        email: ""
    })
    const [errors, setErrors] = useState({})

    const navigate = useNavigate()

    const {isAuth} = useUser()

    useEffect(() => {
        if(isAuth) {
            navigate("/")
        }
    }, [isAuth])

    const handleChange = (event) => {
        let value = event.target.value;

        setformData({email: value})
    }

    const onValidate = () => {
        let isError = false
        if(!isEmail(formData.email)) {
            setErrors({email: "The email you entered is not in a valid format. Please enter a valid email address, such as user@example.com."})
            isError = true
        }

        return isError
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        let validate = onValidate();

        if(!validate) {
            const response = await verifyEmailServices(formData.email)
            console.log(response.message)
            if(!response.success){
                setErrors({verifyEmail: response.message})
            }
            else {
                alert(`Recovery Email Sent Successfully. Check your inbox`)
                navigate("/login")
            }
        }
    }

    return (
        <div className={cssLogin.loginContainer}>
            <img src="../../public/img/logo.png" alt="Logo" />
            <form id="loginForm" onSubmit={handleSubmit}>
                <label>Enter your account's email:</label>
                <input
                    type="text"
                    name="email"
                    style={errors.email || errors.verifyEmail ? { border: "1px solid #fe0202" } : {}}
                    id="username"
                    placeholder="usuario@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                {errors.email && (
                    <p style={{ color: "red" }}>{errors.email}</p>
                )}

                {errors.verifyEmail  && (
                    <p style={{ color: "red" }}>{errors.verifyEmail}</p>
                )}
                <button type="submit">Send</button>
            </form>
        </div>
    )
}

export default VerifyEmail;