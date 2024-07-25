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
            message: "The entered firstName is not valid. Please enter a valid firstName",
            activate: false
        },

        lastName: {
            message: "The entered lastName is not valid. Please enter a valid lastName",
            activate: false
        },

        address: {
            message: "The entered address is not valid. Please enter a valid address",
            activate: false
        },

        phone: {
            message: "The entered phone is not valid. Please enter a valid phone",
            activate: false
        },

        password: {
            message: "Invalida password format. Your password must include at least one uppercase letter, one lowercase letter, numbers, and special characters. Additionally, it should be between 8 and 20 characters in length.",
            activate: false
        },

        password2: {
            message: "The passwords don't match",
            activate: false
        },

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

        let regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&()*\-_=+{};:,<.>])[A-Za-z\d!@#$%^&()*\-_=+{};:,<.>.]{8,}$/;

        let newFormErrors = { ...formErrors };

        switch (name) {
            case "firstName":
                newFormErrors.firstName.activate = !regex.test(value) || value.length > 50;
                break;

            case "lastName":
                newFormErrors.lastName.activate = !regex.test(value) || value.length > 50;
                break;

            case "address":
                newFormErrors.address.activate = value.length > 255;
                break;

            case "phone":
                newFormErrors.phone.activate = value.length > 10 || !validator.isNumeric(value);
                break;

            case "password":
            case "password2":

            console.log(password.value)
            console.log(password2.value)

                const passwordsMatch = password.value === password2.value;
                const passwordIsValid = regexPassword.test(value);

                newFormErrors.password.activate = !(passwordIsValid);
                newFormErrors.password2.activate = !(passwordsMatch);
                break;

            default:
                break;
        }

        newFormErrors.errors = Object.values(newFormErrors).some(error => error.activate);
        setFormErrors(newFormErrors);

    }

    const alertUserModified = () => {
        alert("¡User modified successfully!");
    }

    const modifyUser = async (event) => {
        event.preventDefault();

        if (!formErrors.errors) {

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

                    setUser({
                        ...user,
                        userFirstName: formData.firstName,
                        userLastName: formData.lastName,
                        userBirthDate: formData.birthDate,
                        userAddress: formData.address,
                        userPhone: formData.phone,
                        userEmail: formData.email,
                        userPassword: formData.password
                    });

                    alertUserModified();
                    navigate("/");
                }
            } catch (error) {
                console.log(error);
            }
        }
    }


    return (
        <div className="edit-user-container">
            <h2>Edit User</h2>
            <form id="editUserForm" onSubmit={modifyUser}>
                <input type="text" name="firstName" style={formErrors.firstName.activate ? { border: "1px solid #fe0202" } : {}} placeholder="First name" required onChange={handleChange} value={formData.firstName} />
                {formErrors.firstName.activate && <p style={{ color: "red" }}> {formErrors.firstName.message} </p>}
                <br />
                <br />

                <input type="text" name="lastName" style={formErrors.lastName.activate ? { border: "1px solid #fe0202" } : {}} placeholder="Last name" required onChange={handleChange} value={formData.lastName} />
                {formErrors.lastName.activate && <p style={{ color: "red" }}> {formErrors.lastName.message} </p>}
                <br />
                <br />

                <input type="date" name="birthDate" id="birthDate" placeholder="Birth Date" value={formData.birthDate} onChange={handleChange} required />
                <br />
                <br />

                <input type="text" name="address" style={formErrors.address.activate ? { border: "1px solid #fe0202" } : {}} placeholder="Address" required onChange={handleChange} value={formData.address} />
                {formErrors.address.activate && <p style={{ color: "red" }}> {formErrors.address.message} </p>}
                <br />
                <br />

                <input type="tel" name="phone" style={formErrors.phone.activate ? { border: "1px solid #fe0202" } : {}} placeholder="Phone" required onChange={handleChange} value={formData.phone} />
                {formErrors.phone.activate && <p style={{ color: "red" }}> {formErrors.phone.message} </p>}
                <br />
                <br />

                <input type="email" name="email" disabled placeholder="Email" required onChange={handleChange} value={formData.email} />
                <br />
                <br />

                <input type="password" name="password" id="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                <br />
                <br />

                <input type="password" name="password2" id="password2" placeholder="Confirm Password" value={formData.password2} onChange={handleChange} />
                {formErrors.password.activate && <p style={{ color: "red" }}> {formErrors.password.message} </p>}
                {formErrors.password2.activate && <p style={{ color: "red" }}> {formErrors.password2.message} </p>}
                <br />
                <br />

                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default ModifyUser;