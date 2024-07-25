import { useContext, useState, useEffect } from "react";
import cssRegister from "../assets/css/registro.module.css"
import { registerServices } from "../services/session.services";
import { userContext } from "../context/userProvider.context";
import { useNavigate } from "react-router-dom";
import validator from "validator"
import { AxiosError } from "axios";

function Register() {

    const { user, setUser } = useContext(userContext);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        birthDate: "",
        address: "",
        phone: "",
        email: "",
        password: "",
        passwordConfirmed: ""
    });

    const [formErrors, setFormErrors] = useState({
        firstName: { message: "The entered firstName is not valid. Please enter a valid firstName (do not enter blank spaces)", activate: false },
        lastName: { message: "The entered lastName is not valid. Please enter a valid lastName (do not enter blank spaces)", activate: false },
        birthDate: { message: "The entered birthDate is not valid. Please enter a valid birthDate, e.g., 2004/08/11", activate: false },
        address: { message: "The entered address is not valid. Please enter a valid address", activate: false },
        phone: { message: "The entered phone is not valid. Please enter a valid phone", activate: false },
        email: { message: "The entered email is not valid. Please enter a valid email, e.g., user@gmail.com.", activate: false },
        errors: false
    });

    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });

        let regex = /^[A-Za-zñÑ]+$/i;
        let today = new Date();

        let newFormErrors = { ...formErrors };

        switch (name) {
            case "firstName":
                newFormErrors.firstName.activate = !regex.test(value) || value.length > 50;
                break;
            case "lastName":
                newFormErrors.lastName.activate = !regex.test(value) || value.length > 50;
                break;
            case "birthDate":
                newFormErrors.birthDate.activate = !validator.isDate(value) || new Date(value) > today;
                break;
            case "address":
                newFormErrors.address.activate = value.length > 255;
                break;
            case "phone":
                newFormErrors.phone.activate = value.length > 10 || !validator.isNumeric(value);
                break;
            case "email":
                newFormErrors.email.activate = value.length > 100 || !validator.isEmail(value);
                break;
            default:
                break;
        }

        newFormErrors.errors = Object.values(newFormErrors).some(error => error.activate);
        setFormErrors(newFormErrors);
    }

    const alertUserCreated = () => {
        alert("¡User created successfully!");
    }

    const register = async (event) => {
        event.preventDefault();

        if (!formErrors.errors) {
            try {
                const data = await registerServices(
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
                    navigate("/");
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <main>
            <div className={cssRegister.registerContainer}>
                <img src="../../public/img/logo.png" alt="Register Logo" className={cssRegister.registerLogo} />
                <h2>Register</h2>
                <form id="registerForm" onSubmit={register}>
                    <input type="text" name="firstName" style={formErrors.firstName.activate ? {border: "1px solid #fe0202"} : {}} placeholder="First name" required onChange={handleChange} value={formData.firstName} />
                    {formErrors.firstName.activate && <p style={{color: "red"}}> {formErrors.firstName.message} </p>}
                    
                    <input type="text" name="lastName" style={formErrors.lastName.activate ? {border: "1px solid #fe0202"} : {}} placeholder="Last name" required onChange={handleChange} value={formData.lastName} />
                    {formErrors.lastName.activate && <p style={{color: "red"}}> {formErrors.lastName.message} </p>}
                    
                    <input type="date" name="birthDate" style={formErrors.birthDate.activate ? {border: "1px solid #fe0202"} : {}} placeholder="Birth date" required onChange={handleChange} value={formData.birthDate} />
                    {formErrors.birthDate.activate && <p style={{color: "red"}}> {formErrors.birthDate.message} </p>}
                    
                    <input type="text" name="address" style={formErrors.address.activate ? {border: "1px solid #fe0202"} : {}} placeholder="Address" required onChange={handleChange} value={formData.address} />
                    {formErrors.address.activate && <p style={{color: "red"}}> {formErrors.address.message} </p>}
                    
                    <input type="tel" name="phone" style={formErrors.phone.activate ? {border: "1px solid #fe0202"} : {}} placeholder="Phone" required onChange={handleChange} value={formData.phone} />
                    {formErrors.phone.activate && <p style={{color: "red"}}> {formErrors.phone.message} </p>}
                    
                    <input type="email" name="email" style={formErrors.email.activate ? {border: "1px solid #fe0202"} : {}} placeholder="Email" required onChange={handleChange} value={formData.email} />
                    {formErrors.email.activate && <p style={{color: "red"}}> {formErrors.email.message} </p>}
                    
                    <button type="submit">Create an account</button>
                </form>
            </div>
        </main> 
    );
}

export default Register;
