import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { updateUserService } from "../services/session.services.js";
import { userContext } from "../context/userProvider.context.jsx";
import { AxiosError } from "axios";

function ModifyUser() {

    const { user, setUser } = useContext(userContext);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        birthDate: "",
        address: "",
        phone: "",
        email: "",  
        password: "",
        password2: ""
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.userFirstName || "",
                lastName: user.userLastName || "",
                birthDate: user.userBirthDate || "",
                address: user.userAddress || "",
                phone: user.userPhone || "",
                email: user.userEmail || "",
                password: "",
                password2: ""
            });
        }
    }, [user]);

    const [formErrors, setFormErrors] = useState({
        firstName: {
            message: "error en el nombre",
            activate: false,
            internalError: false
        },
        lastName: {
            message: "error en el apellido",
            activate: false,
            internalError: false
        },
        birthDate: {
            message: "error en el cumple",
            activate: false,
            internalError: false
        },
        address: {
            message: "error en la direccion",
            activate: false,
            internalError: false
        },
        phone: {
            message: "error en el celu",
            activate: false,
            internalError: false
        },
        email: {
            message: "error en el correo",
            activate: false,
            internalError: false
        },
        password: {
            message: "error en la pasword",
            activate: false,
            internalError: false
        }
    })

    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });

        switch (name) {
            case "firstName":
                if (!value) {
                    setFormErrors({ ...formErrors, firstName: { message: "First Name is required", activate: true } });
                } else {
                    setFormErrors({ ...formErrors, firstName: { message: "", activate: false } });
                }
                break;

            case "lastName":
                if (!value) {
                    setFormErrors({ ...formErrors, lastName: { message: "Last Name is required", activate: true } });
                } else {
                    setFormErrors({ ...formErrors, lastName: { message: "", activate: false } });
                }
                break;

            case "birthDate":
                const TODAY = new Date();
                const LOWERLIMIT = new Date().setFullYear(TODAY.getFullYear() - 65);
                const UPPERLIMIT = new Date().setFullYear(TODAY.getFullYear() - 16);

                if (!value) {
                    setFormErrors({ ...formErrors, birthDate: { message: "BirthDate is required", activate: true } });
                } else if (!validator.isDate(value)) {
                    setFormErrors({ ...formErrors, birthDate: { message: "Invalid date format", activate: true } });
                } else if (new Date(value) < LOWERLIMIT || new Date(value) > UPPERLIMIT) {
                    setFormErrors({ ...formErrors, birthDate: { message: "The worker must be adult", activate: true } });
                } else {
                    setFormErrors({ ...formErrors, birthDate: { message: "", activate: false } });
                }
                break;

            case "address":
                if (!value) {
                    setFormErrors({ ...formErrors, address: { message: "Address is required", activate: true } });
                } else {
                    setFormErrors({ ...formErrors, address: { message: "", activate: false } });
                }
                break;

            case "phone":
                if (!value) {
                    setFormErrors({ ...formErrors, phone: { message: "Phone is required", activate: true } });
                } else {
                    setFormErrors({ ...formErrors, phone: { message: "", activate: false } });
                }
                break;

            case "email":
                if (!value) {
                    setFormErrors({ ...formErrors, email: { message: "Email is required", activate: true } });
                } else if (!validator.isEmail(value)) {
                    setFormErrors({ ...formErrors, email: { message: "Invalid email format", activate: true } });
                } else {
                    setFormErrors({ ...formErrors, email: { message: "", activate: false } });
                }
                break;

            case "password":
            case "password2":
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{};:,<.>])[A-Za-z\d!@#$%^&*()-_=+{};:,<.>.]{8,}$/;

                if (!formData.password) {
                    setFormErrors({ ...formErrors, password: { message: "Password is required", activate: true } });
                } else if (!passwordRegex.test(formData.password)) {
                    setFormErrors({ ...formErrors, password: { message: "Invalid password format", activate: true } });
                } else if (formData.password !== formData.password2) {
                    setFormErrors({ ...formErrors, password: { message: "Passwords do not match", activate: true } });
                } else {
                    setFormErrors({ ...formErrors, password: { message: "", activate: false } });
                }
                break;

            default:
                break;
        }
    };

    const modifyUser = async (event) => {
        event.preventDefault();

        try {
            const data = await updateUserService(
                
                user.userToken.token,
                formData.firstName,
                formData.lastName,
                formData.birthDate,
                formData.address,
                formData.phone,
                formData.email,
                formData.password,
                formData.password2
            );

            if (data instanceof AxiosError) {
                if (data.response.status === 500) {
                    setFormErrors({
                        ...formErrors,
                        message: "Server internal error... please contact support",
                        activate: true,
                        internalError: true
                    });
                } else if (data.response.status === 401) {
                    console.log(user.userToken)
                    console.log("Aqui estoy ctm")
                    setFormErrors({
                        ...formErrors,
                        message: "Data entered incorrectly",
                        activate: true,
                        internalError: true
                    });
                }
            } else {
                console.log("llege aqui")
                setUser({
                    ...user,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    birthDate: formData.birthDate,
                    address: formData.address,
                    phone: formData.phone,
                    email: formData.email,
                    password: formData.password
                });

                navigate("/");
            }
        } catch (error) {
            console.error("Error modifying user:", error);
        }
    };

    return (
        <div className="edit-user-container">
            <h2>Edit User</h2>
            <form id="editUserForm" onSubmit={modifyUser}>
                <input type="text" name="firstName" id="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                <input type="text" name="lastName" id="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                <input type="date" name="birthDate" id="birthDate" placeholder="Birth Date" value={formData.birthDate} onChange={handleChange} required />
                <input type="text" name="address" id="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
                <input type="tel" name="phone" id="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
                <input type="email" name="email" id="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" id="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                <input type="password" name="password2" id="password2" placeholder="Confirm Password" value={formData.password2} onChange={handleChange} />

                {formErrors.activate && <p className="error-message">{formErrors.message}</p>}

                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default ModifyUser;