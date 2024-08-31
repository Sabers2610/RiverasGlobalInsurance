import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/userProvider.context";
import sessionServices from "../services/session.services";
import cssLogin from "../assets/css/login.module.css";




function RecoveryPassword() {
    const [formData, setFormaData] = useState({
        password: "",
        password2: ""
    })
    const [errors, setErrors] = useState({})
    const { isAuth } = useUser()

    const navigate = useNavigate()

    const { resetToken } = useParams()

    useEffect(() => {
        if (isAuth) {
            navigate("/")
            return
        }
        else if (!resetToken) {
            navigate("/login")
            return 
        }
        const validate = async () => {
            const response = await sessionServices.validateTokenServices(resetToken)
            if (!response.success) {
                navigate("/login")
                return
            }
        }
        validate();
    }, [resetToken, isAuth, navigate])

    const handleChange = (event) => {
        let { name, value } = event.target

        setFormaData({ ...formData, [name]: value })
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

        const validate = onValidate()
        if (!validate) {
            const response = await sessionServices.recoveryPasswordServices(resetToken, formData.password, formData.password2)
            if (!response.success) {
                setErrors({ recoveryPasswordError: response.message })
            }
            else {
                alert("Password changed successfully")
                navigate("/login")
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
                    style={errors.password || errors.recoveryPasswordError ? { border: "1px solid #fe0202" } : {}}
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
                    style={errors.password2 || errors.recoveryPasswordError ? { border: "1px solid #fe0202" } : {}}
                    id="password2"
                    placeholder="password"
                    value={formData.password2}
                    onChange={handleChange}
                    required
                />

                {errors.password2 && (
                    <p style={{ color: "red" }}>{errors.password2}</p>
                )}

                {errors.recoveryPasswordError && (
                    <p style={{ color: "red" }}>{errors.recoveryPasswordError}</p>
                )}
                <button type="submit">Save</button>
            </form>
        </div>
    )
}

export default RecoveryPassword