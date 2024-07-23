import { useContext, useState } from "react";
import "../../public/assets/css/login.css"
import { changePasswordServices, loginServices } from "../services/session.services";
import { userContext } from "../context/userProvider.context";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

function ChangePassword() {
    const [formData, setFormaData] = useState({
        password: "",
        password2: ""
    })

    const [formError,  setFormError] = useState({
        password: {
            message: "The password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 symbol (e.g., !@#$%^&*), and be at least 8 characters long.",
            error: false
        },
        password2: {
            message: "The passwords don't  match.",
            error: false,
        },
        services: {
            message: "Server internal error... please contact support",
            error: false,
        }
    })

    const navigate = useNavigate()

    const { user, setUser } = useContext(userContext)

    const handleChange = (event) => {
        const {name, value} = event.target
        let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&()*\-_=+{};:,<.>])[A-Za-z\d!@#$%^&()*\-_=+{};:,<.>.]{8,}$/;

        setFormaData({
            ...formData,
            [name]: value
        })
        switch(name){
            case "password": 
                if(!regex.test(value) || value === ""){
                    setFormError(prev => ({
                        ...prev,
                        password: {...prev, error: true}
                    }))
                }
                else {
                    setFormError(prev => ({
                        ...prev,
                        password: {...prev, error: false}
                    }))
                }
                break
            case "password2":
                if(password2 !== formData.password || value === ""){
                    setFormError(prev => ({
                        ...prev,
                        password2: {...prev, error: true}
                    }))
                }
                else {
                    setFormError(prev => ({
                        ...prev,
                        password2: {...prev, error: false}
                    }))
                }
                break
            default: 
                break
        }
    }

    const changePassword = async (event) => {
        event.preventDefault();

        if(!formError.password.error || !formError.password2.error){
            const data = await changePasswordServices(user.userToken.token, formData.password, formData.password2)
            if(data instanceof AxiosError){
                if(data.response.status === 500){
                    setFormError(prev => ({
                        ...prev, services: {...prev, error: true}
                    }))
                }
                else if(data.response.status === 401){
                    setFormError(prev => ({
                        ...prev, services: {...prev, error: true}
                    }))
                }
            }
            else { 
                setUser({
                    ...user,
                    userFirstSession: false,
                    userPasswordChanged: false
                })
                return navigate("/")
            }
        }
    }
    return (
        <div className="login-container">
            <img src="/assets/img/logo.png" alt="Logo" />
            <form id="loginForm" onSubmit={changePassword}>
                <input type="password" name="password" style={formError.password.error ? {border: "1px solid #fe0202"} : {}} id="password" placeholder="password" value={formData.password} onChange={handleChange} required />
                
                {formError.password.error && (
                        <p style={{color: "red"}}>{formError.password.message}</p>
                )}

                <input type="password" name="password2" style={formError.password2.error ? {border: "1px solid #fe0202"} : {}} id="password2" placeholder="password" value={formData.password2} onChange={handleChange} required />

                {formError.password2.error && (
                        <p style={{color: "red"}}>{formError.password2.message}</p>
                )}
                <button type="submit">submit</button>
            </form>
        </div>
    )
}

export default ChangePassword