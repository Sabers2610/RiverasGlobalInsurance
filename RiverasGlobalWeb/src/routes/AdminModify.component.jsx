import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import validator from "validator";
import { updateAdminService, fetchUserByIdService } from "../services/session.services.js";
import { userContext } from "../context/userProvider.context.jsx";
import cssAdminModify from "../assets/css/adminModify.module.css";

function AdminModify() {

    const { user, setUser } = useContext(userContext);
    const { userId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        birthDate: "",
        address: "",
        phone: "",
        email: ""
    });

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
        errors: false
    });

    useEffect(() => {
        const fetchUser = async () => {
            if (userId) {
                try {
                    const fetchedUser = await fetchUserByIdService(user.userToken.token, userId);
                    setFormData({
                        firstName: fetchedUser.userFirstName || "",
                        lastName: fetchedUser.userLastName || "",
                        birthDate: fetchedUser.userBirthDate || "",
                        address: fetchedUser.userAddress || "",
                        phone: fetchedUser.userPhone || "",
                        email: fetchedUser.userEmail || ""
                    });
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            }
        };

        fetchUser();
    }, [userId, user.userToken.token]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });

        let regex = /^[A-Za-zñÑ]+$/i;
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

            default:
                break;
        }

        newFormErrors.errors = Object.values(newFormErrors).some(error => error.activate);
        setFormErrors(newFormErrors);
    };

    const alertAdminModify = () => {
        confirm("¡User modified successfully!");
    };

    const adminModify = async (event) => {
        event.preventDefault();

        if (!formErrors.errors) {
            try {
                const data = await updateAdminService(
                    user.userToken.token,
                    userId, // Asegúrate de pasar el userId aquí
                    formData.firstName,
                    formData.lastName,
                    formData.birthDate,
                    formData.address,
                    formData.phone,
                    formData.email
                );

                if (data.error) {
                    if (data.status === 500) {
                        setFormErrors(prev => ({
                            ...prev,
                            message: "Server internal error... please contact support",
                            activate: true,
                        }));
                    } else if (data.status === 400 || data.status === 401) {
                        setFormErrors(prev => ({
                            ...prev,
                            message: "Data entered incorrectly",
                            activate: true,
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
                    });

                    alertAdminModify();
                    navigate("/GetAll");
                }
            } catch (error) {
                console.error('Error updating user:', error);
            }
        }
    };

    return (
        <main>
            <section className={cssAdminModify.editUserContainer}>
                <div className={cssAdminModify.detailsHeader}>
                    <div className={cssAdminModify.initials}>
                        {formData.firstName[0] || ''}{formData.lastName[0] || ''}
                    </div>
                    <h2>{formData.firstName} {formData.lastName}</h2>
                </div>

                <form id="editUserForm" onSubmit={adminModify}>
                    <div className={cssAdminModify.data}>
                        <div className={cssAdminModify.row}>
                            <label htmlFor="firstName">First Name</label>
                            <input 
                                type="text" 
                                name="firstName" 
                                id="firstName" 
                                placeholder="First Name" 
                                onChange={handleChange} 
                                value={formData.firstName} 
                                style={formErrors.firstName.activate ? { border: "1px solid #fe0202" } : {}} 
                            />
                            {formErrors.firstName.activate && <p style={{ color: "red" }}> {formErrors.firstName.message} </p>}
                        </div>

                        <div className={cssAdminModify.row}>
                            <label htmlFor="lastName">Last Name</label>
                            <input 
                                type="text" 
                                name="lastName" 
                                id="lastName" 
                                placeholder="Last Name" 
                                onChange={handleChange} 
                                value={formData.lastName} 
                                style={formErrors.lastName.activate ? { border: "1px solid #fe0202" } : {}} 
                            />
                            {formErrors.lastName.activate && <p style={{ color: "red" }}> {formErrors.lastName.message} </p>}
                        </div>

                        <div className={cssAdminModify.row}>
                            <label htmlFor="birthDate">Birth Date</label>
                            <input 
                                type="date" 
                                name="birthDate" 
                                id="birthDate" 
                                placeholder="Birth Date" 
                                onChange={handleChange} 
                                value={formData.birthDate} 
                            />
                        </div>

                        <div className={cssAdminModify.row}>
                            <label htmlFor="address">Address</label>
                            <input 
                                type="text" 
                                name="address" 
                                id="address" 
                                placeholder="Address" 
                                onChange={handleChange} 
                                value={formData.address} 
                                style={formErrors.address.activate ? { border: "1px solid #fe0202" } : {}} 
                            />
                            {formErrors.address.activate && <p style={{ color: "red" }}> {formErrors.address.message} </p>}
                        </div>

                        <div className={cssAdminModify.row}>
                            <label htmlFor="phone">Phone</label>
                            <input 
                                type="tel" 
                                name="phone" 
                                id="phone" 
                                placeholder="Phone" 
                                onChange={handleChange} 
                                value={formData.phone} 
                                style={formErrors.phone.activate ? { border: "1px solid #fe0202" } : {}} 
                            />
                            {formErrors.phone.activate && <p style={{ color: "red" }}> {formErrors.phone.message} </p>}
                        </div>

                        <div className={cssAdminModify.row}>
                            <label htmlFor="email">Email</label>
                            <input 
                                disabled 
                                type="email" 
                                name="email" 
                                id="email" 
                                placeholder="Email" 
                                onChange={handleChange} 
                                value={formData.email} 
                            />
                        </div>
                    </div>
                    <button className={cssAdminModify.more} type="submit">Save</button>
                </form>
            </section>
        </main>
    );
}

export default AdminModify;
