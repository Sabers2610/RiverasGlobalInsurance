import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { updateUserService } from "../services/session.services.js";
import { userContext } from "../context/userProvider.context.jsx";
import modifyCss from '../assets/css/modify.module.css'

function ModifyUser() {

    const { user, setUser } = useContext(userContext);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        birthDate: "",
        address: "",
        phone: "",
        email: "",
        currentPassword: "",
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
                currentPassword: "",
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

        currentPassword: {
            message: "Invalid password",
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
                const passwordIsValid = regexPassword.test(value);
                newFormErrors.password.activate = !(passwordIsValid);
                break;

            case "password2":
                const passwordsMatch = password.value === password2.value;
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
                    formData.currentPassword,
                    formData.password,
                    formData.password2
                );

                if (data.error) {
                    if (data.status === 500) {
                        setFormErrors(prev => ({
                            ...prev,
                            currentPassword: {
                                ...prev.currentPassword,
                                message: "Server internal error... please contact support",
                                activate: true,
                            }
                        }));
                    } else if (data.status === 400 || data.status === 401) {
                        setFormErrors(prev => ({
                            ...prev,
                            currentPassword: {
                                ...prev.currentPassword,
                                message: "Data entered incorrectly",
                                activate: true,
                            }
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
            }
        }
    }


    return (

        <main>
            <section className={modifyCss.editUserContainer}>

                <div className={modifyCss.detailsHeader}>
                    <div className={modifyCss.initials}>{user.userFirstName[0] || ''}{user.userLastName[0] || ''}</div>
                    <h2>{user.userFirstName} {user.userLastName}</h2>
                </div>

                <form className={modifyCss.editUserForm} id="editUserForm" onSubmit={modifyUser}>

                    <div className={modifyCss.data}>

                        <div className={modifyCss.row}>
                            <label for="FirstName">First Name</label>
                            <input type="text" name="firstName" id="firstName" placeholder="First Name" onChange={handleChange} value={formData.firstName} style={formErrors.firstName.activate ? { border: "1px solid #fe0202" } : {}} />
                            {formErrors.firstName.activate && <p style={{ color: "red" }}> {formErrors.firstName.message} </p>}
                        </div>

                        <div className={modifyCss.row}>
                            <label for="LastName">LastName</label>
                            <input type="text" name="lastName" id="lastName" placeholder="Last Name" onChange={handleChange} value={formData.lastName} style={formErrors.lastName.activate ? { border: "1px solid #fe0202" } : {}} />
                            {formErrors.lastName.activate && <p style={{ color: "red" }}> {formErrors.lastName.message} </p>}
                        </div>

                        <div className={modifyCss.row}>
                            <label for="birthDate">Birth Date</label>
                            <input type="date" name="birthDate" id="birthDate" placeholder="Birth Date" onChange={handleChange} value={formData.birthDate} />
                        </div>

                        <div className={modifyCss.row}>
                            <label for="address">Address</label>
                            <input type="text" name="address" id="address" placeholder="Address" onChange={handleChange} value={formData.address} style={formErrors.address.activate ? { border: "1px solid #fe0202" } : {}} />
                            {formErrors.address.activate && <p style={{ color: "red" }}> {formErrors.address.message} </p>}
                        </div>

                        <div className={modifyCss.row}>
                            <label for="phone">Phone</label>
                            <input type="tel" name="phone" id="phone" placeholder="Phone" onChange={handleChange} value={formData.phone} style={formErrors.phone.activate ? { border: "1px solid #fe0202" } : {}} />
                            {formErrors.phone.activate && <p style={{ color: "red" }}> {formErrors.phone.message} </p>}
                        </div>

                        <div className={modifyCss.row}>
                            <label for="email">Email</label>
                            <input disabled type="email" name="email" id="email" placeholder="Email" onChange={handleChange} value={formData.email} />
                        </div>

                    </div>
                    <button className={modifyCss.more} type="submit">Save</button>

                </form>


                <form className={modifyCss.editUserFormPassword} id="editUserFormPassword" onSubmit={modifyUser}>

                    <div className={modifyCss.data}>

                        <div className={modifyCss.row}>
                            <label for="currentPassword">Enter the current Password</label>
                            <input type="password" name="currentPassword" id="currentPassword" placeholder="Current Password" onChange={handleChange} value={formData.currentPassword} style={formErrors.currentPassword.activate ? { border: "1px solid #fe0202" } : {}} />
                            {formErrors.currentPassword.activate && <p style={{ color: "red" }}> {formErrors.currentPassword.message} </p>}
                        </div>

                        <div className={modifyCss.row}>
                            <label for="password">Enter the new password</label>
                            <input type="password" name="password" id="password" placeholder="Password" onChange={handleChange} value={formData.password} />
                        </div>

                        <div className={modifyCss.row}>
                            <label for="password2">Confirm the new password</label>
                            <input type="password" name="password2" id="password2" placeholder="Confirm Password" onChange={handleChange} />
                            {formErrors.password.activate && <p style={{ color: "red" }}> {formErrors.password.message} </p>}
                            {formErrors.password2.activate && <p style={{ color: "red" }}> {formErrors.password2.message} </p>}
                        </div>

                        <button className={modifyCss.morePassword} type="submit">Change password</button>

                    </div>

                </form>

            </section>
        </main>
    )
}

export default ModifyUser;