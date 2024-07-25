import { useNavigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import cssGetAll from "../assets/css/polizas.module.css";
import { fetchUsersService, fetchEmailService, fetchFirstNameService, fetchLastNameService } from "../services/session.services";
import { userContext } from "../context/userProvider.context.jsx";
import { AxiosError } from "axios";

function GetAll() {
    const { user } = useContext(userContext);
    const navigate = useNavigate();
    const [users, setUsers] = useState({});
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ email: "", firstname: "", lastname: "" });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await fetchUsersService(user.userToken.token);
                console.log('Fetched users:', fetchedUsers);
                if (fetchedUsers && typeof fetchedUsers === 'object' && Object.keys(fetchedUsers).length > 0) {
                    setUsers(fetchedUsers);
                } else {
                    console.error('No users found or invalid format');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [user.userToken.token]);

    const alertUserCreated = () => {
        alert("¡user found successfully!");
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormErrors({});

        try {
            let data;
            if (formData.email) {
                data = await fetchEmailService(user.userToken.token, formData.email);
            } else if (formData.firstname) {
                if (!formData.firstname) {
                    setFormErrors(prev => ({
                        ...prev,
                        message: "First name is required",
                        activate: true,
                        sessionError: true
                    }));
                    return;
                }
                data = await fetchFirstNameService(user.userToken.token, formData.firstname);
            } else if (formData.lastname) {
                data = await fetchLastNameService(user.userToken.token, formData.lastname);
            }

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
                setUsers({ [data.id]: data });
                alertUserCreated();
            }
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            setFormErrors(prev => ({
                ...prev,
                message: "An unexpected error occurred",
                activate: true,
                sessionError: true
            }));
        }
    };

    const handleClearFilters = async () => {
        setFormData({ email: "", firstname: "", lastname: "" });
        setFormErrors({});

        try {
            const fetchedUsers = await fetchUsersService(user.userToken.token);
            setUsers(fetchedUsers);
        } catch (error) {
            console.error('Error fetching users after clearing filters:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (Object.keys(users).length === 0) {
        return <div>No user data available</div>;
    }

    return (
        <main>
            <aside className={cssGetAll.filters}>
                <h2>Users</h2>
                <form id="filterForm" onSubmit={handleSubmit}>
                    <div className={cssGetAll.filterGroup}>
                        <label htmlFor="firstname">First name</label>
                        <input
                            type="text"
                            id="firstname"
                            name="firstname"
                            placeholder="enter the first name..."
                            value={formData.firstname}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={cssGetAll.filterGroup}>
                        <label htmlFor="lastname">Last name</label>
                        <input
                            type="text"
                            id="lastname"
                            name="lastname"
                            placeholder="enter the Last name..."
                            value={formData.lastname}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={cssGetAll.filterGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            placeholder="enter the Email..."
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button type="submit">Aplicar filtro</button>
                    
                </form>
                <button type="button" onClick={handleClearFilters}>Clear Filters</button>
                {formErrors.activate && (
                    <div className="error-message">
                        {formErrors.message}
                    </div>
                )}
            </aside>

            <section className={cssGetAll.policies}>
                {Object.keys(users).map(key => {
                    const user = users[key];
                    return (
                        <div className={cssGetAll.policyCard} key={key}>
                            <h3>{user.userFirstName} {user.userLastName}</h3>
                            <p>{user.userBirthDate}</p>
                            <p>Procesado</p>
                            <p>Wellcare</p>
                            <div className={cssGetAll.icons}>
                                <img src="../../public/img/ojo.png" alt="View" className={cssGetAll.icon} />
                                <img src="../../public/img/lapiz.png" alt="Edit" className={cssGetAll.icon} />
                            </div>
                        </div>
                    );
                })}
            </section>
        </main>
    );
}

export default GetAll;
