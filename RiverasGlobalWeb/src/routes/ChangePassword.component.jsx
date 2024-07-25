import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/userProvider.context.jsx'
import { changePasswordServices } from '../services/session.services.js'
import cssLogin from '../assets/css/login.module.css'

function ChangePassword() {
    const [formData, setFormData] = useState({
        password: "",
        password2: ""
    })
    const { user, isAuth, setUser } = useUser()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuth) {
            return navigate("/login")
        }
    }, [isAuth])

    const [errors, setErrors] = useState({})

    const handleChange = (event) => {
        let { name, value } = event.target

        setFormData({ ...formData, [name]: value })

    }

    const onValidate = () => {
        let isErrors = false

        let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&()*\-_=+{};:,<.>])[A-Za-z\d!@#$%^&()*\-_=+{};:,<.>.]{8,}$/;
        if (!regex.test(formData.password)) {
            isErrors = true
            setErrors({ password: "Your password must include at least one uppercase letter, one lowercase letter, numbers, and special characters. Additionally, it should be between 8 and 20 characters in length." })
        }
        else if (formData.password !== formData.password2) {
            isErrors = true
            setErrors({ password2: "the passwords don't match" })
        }
        else {
            isErrors = false
            setErrors({})
        }

        return isErrors
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        let validate = onValidate();

        if (!validate) {
            const response = await changePasswordServices(user.userToken.token, formData.password, formData.password2)
            if (!response.success) {
                if (response.status === 401) {
                    navigate("/login")
                }
                else {
                    setErrors({ changePassordError: response.message })
                }

            }
            else {
                alert("Password changed successfully")
                setUser({...user, userFirstSession: false})
                navigate("/")
            }
        }
    }
    return (
        <div className={cssLogin.loginContainer}>
            <img src="/img/logo.png" alt="Logo" />
            <form id="loginForm" onSubmit={handleSubmit}>
                <label>New password:</label>
                <input
                    type="password"
                    name="password"
                    style={errors.email || errors.changePassordError ? { border: "1px solid #fe0202" } : {}}
                    id="password"
                    placeholder="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                {errors.password && (
                    <p style={{ color: "red" }}>{errors.password}</p>
                )}
                <label>Repeat new password:</label>
                <input
                    type="password"
                    name="password2"
                    style={errors.password2 || errors.changePassordError ? { border: "1px solid #fe0202" } : {}}
                    id="password2"
                    placeholder="password"
                    value={formData.password2}
                    onChange={handleChange}
                    required
                />

                {errors.password2 && (
                    <p style={{ color: "red" }}>{errors.password2}</p>
                )}

                {errors.changePassordError && (
                    <p style={{ color: "red" }}>{errors.changePassordError}</p>
                )}
                <button type="submit">Save</button>
            </form>
        </div>
    )
}

export default ChangePassword;