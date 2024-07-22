import { useContext, useState } from "react";
import "../../public/assets/css/registro.css"
import { loginServices } from "../services/session.services";
import { userContext } from "../context/userProvider.context";
import { useNavigate } from "react-router-dom";
import validator from "validator"
import { AxiosError } from "axios";

function Register() {

    const { user, setUser } = useContext(userContext);

    const [formData, setFormData] = useState({
        "firstName": "",
        "lastName": "",
        "birthDate": "",
        "address": "",
        "phone": "",
        "email": "",
        "password": "",
        "passwordConfirmed": ""
    });

    const [formErrors, setFormErrors] = useState({
        firstName: {
            message: "The entered email is not valid. Please enter a valid email, e.g., user@gmail.com.",
            activate: false,
            internalError: false
        },
        lastName: {
            message: "The entered email is not valid. Please enter a valid email, e.g., user@gmail.com.",
            activate: false,
            internalError: false
        },
        birthDate: {
            message: "The entered email is not valid. Please enter a valid email, e.g., user@gmail.com.",
            activate: false,
            internalError: false
        },
        address: {
            message: "The entered email is not valid. Please enter a valid email, e.g., user@gmail.com.",
            activate: false,
            internalError: false
        },
        phone: {
            message: "The entered email is not valid. Please enter a valid email, e.g., user@gmail.com.",
            activate: false,
            internalError: false
        },
        email: {
            message: "The entered email is not valid. Please enter a valid email, e.g., user@gmail.com.",
            activate: false,
            internalError: false
        },
        password: {
            message: "The entered email is not valid. Please enter a valid email, e.g., user@gmail.com.",
            activate: false,
            internalError: false
        }
    });

    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // validamos los campos
        let regex = /^[A-Za-z]+$/i;
        let today = new Date();
        switch (name) {
            case "firstName":
                if (!regex.test(value) || value.length > 50) {
                    setFormErrors(prev => (
                        { ...prev, firstName: { ...prev, activate: true } })
                    );
                }
                break;
            case "lastName":
                if (!regex.test(value) || value.length > 50) {
                    setFormErrors(prev => (
                        { ...prev, lastName: { ...prev, activate: true } })
                    );
                }
                break;
            case "birthDate":
                if (!validator.isDate(value) || new Date(value) > today) {
                    setFormErrors(prev => (
                        { ...prev, birthDate: { ...prev, activate: true } })
                    );
                }
                break;
            case "address":
                if (value.length > 255) {
                    setFormErrors(prev => (
                        { ...prev, address: { ...prev, activate: true } })
                    );
                }
                break;
            case "phone":
                if (value.length > 10 || !validator.isNumeric(value)) {
                    setFormErrors(prev => (
                        { ...prev, phone: { ...prev, activate: true } })
                    );
                }
                break;
            case "email":
                if (value.length > 100 || !validator.isEmail(value)) {
                    setFormErrors(prev => (
                        { ...prev, email: { ...prev, activate: true } })
                    );
                }
                break;
            default:
                break;
        }
    };

    function alertUserCreated() {
        alert("¡User created successfully!");
    }

    const register = async (event) => {
        try {
            event.preventDefault();

            if (!Object.values(formErrors).some(error => error.activate)) {
                const data = await loginServices.register(
                    user.userToken.token,
                    formData.firstName, 
                    formData.lastName, 
                    formData.birthDate, 
                    formData.address, 
                    formData.phone, 
                    formData.email
                );

                if (data instanceof AxiosError) {
                    if (data.response.status === 500) {
                        setFormErrors(prev => ({
                            ...prev,
                            message: "Server internal error... please contact support",
                            activate: true,
                            sessionError: true
                        }));
                    } else if (data.response.status === 401) {
                        setFormErrors(prev => ({
                            ...prev,
                            message: "Data entered incorrectly",
                            activate: true,
                            sessionError: true
                        }));
                    }
                } else {
                    alertUserCreated();
                    navigate("/login");
                }
            }
        } catch (error) {
            console.log("ERROR");
            console.log(error);
        }
    };

    return (
        <div className="register-container">
            <img src="../assets/img/logo.png" alt="Register Logo" className="register-logo" />
            <h2>Register</h2>
            <form id="registerForm" onSubmit={register}>
                <input type="text" name="firstName" placeholder="First name" required onChange={handleChange} value={formData.firstName} />
                <input type="text" name="lastName" placeholder="Last name" required onChange={handleChange} value={formData.lastName} />
                <input type="date" name="birthDate" placeholder="Birth date" required onChange={handleChange} value={formData.birthDate} />
                <input type="text" name="address" placeholder="Address" required onChange={handleChange} value={formData.address} />
                <input type="tel" name="phone" placeholder="Phone" required onChange={handleChange} value={formData.phone} />
                <input type="email" name="email" placeholder="Email" required onChange={handleChange} value={formData.email} />
                {formErrors.activate && <p className="error-message">{formErrors.message}</p>}
                <button type="submit">Create an account</button>
            </form>
        </div>
    );
}

export default Register;