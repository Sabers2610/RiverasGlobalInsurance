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
            message: "error in the first name",
            activate: false,
            internalError: false
        },
        lastName: {
            message: "error in the last name",
            activate: false,
            internalError: false
        },
        birthDate: {
            message: "birthday mistake",
            activate: false,
            internalError: false
        },
        address: {
            message: "error in address",
            activate: false,
            internalError: false
        },
        phone: {
            message: "error on the phone",
            activate: false,
            internalError: false
        },
        email: {
            message: "error in email",
            activate: false,
            internalError: false
        },
        password: {
            message: "pasword error",
            activate: false,
            internalError: false
        },
        password2: {
            message: "password confirmation error ",
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
                }else {
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
                if (!value) {
                    setFormErrors({ ...formErrors, birthDate: { message: "BirthDate is required", activate: true } });
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
                    setFormErrors({
                        ...formErrors,
                        message: "Data entered incorrectly",
                        activate: true,
                        internalError: true
                    });
                }
            } else {
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
                {formErrors.firstName.activate && <p className="error-message">{formErrors.firstName.message}</p>}
                <br />

                <input type="text" name="lastName" id="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                {formErrors.lastName.activate && <p className="error-message">{formErrors.message}</p>}
                <br />

                <input type="date" name="birthDate" id="birthDate" placeholder="Birth Date" value={formData.birthDate} onChange={handleChange} required />
                <br />

                <input type="text" name="address" id="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
                {formErrors.address.activate && <p className="error-message">{formErrors.message}</p>}
                <br />

                <input type="tel" name="phone" id="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
                {formErrors.phone.activate && <p className="error-message">{formErrors.message}</p>}
                <br />

                <input type="email" name="email" id="email" placeholder="Email" disabled value={formData.email} onChange={handleChange} required />
                {formErrors.email.activate && <p className="error-message">{formErrors.message}</p>}
                <br />

                <input type="password" name="password" id="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                {formErrors.password.activate && <p className="error-message">{formErrors.message}</p>}
                <br />

                <input type="password" name="password2" id="password2" placeholder="Confirm Password" value={formData.password2} onChange={handleChange} />
                {formErrors.password2.activate && <p className="error-message">{formErrors.message}</p>}
                <br />

                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default ModifyUser;