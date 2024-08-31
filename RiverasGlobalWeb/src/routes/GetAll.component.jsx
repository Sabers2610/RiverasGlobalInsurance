import { useNavigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import cssGetAll from "../assets/css/polizas.module.css";
import { fetchUsersService, fetchEmailService, fetchFirstNameService, fetchLastNameService, disableService } from "../services/session.services";
import { userContext } from "../context/userProvider.context.jsx";
import { AxiosError } from "axios";

import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

function GetAll() {
    const { user } = useContext(userContext);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ email: "", firstname: "", lastname: "" });
    const [formErrors, setFormErrors] = useState({});
    const [click, setClick] = useState(false)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await fetchUsersService(user.userToken.token);
                console.log('Fetched users:', fetchedUsers);
                if (fetchedUsers.success) {
                    setUsers(fetchedUsers.users);
                } else {
                    console.error('No users found or invalid format');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        setClick(false)
        fetchUsers();
    }, [user.userToken.token, click]);

    const alertUserCreated = () => {
        alert("¡user found successfully!");
    };

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
                data = await fetchFirstNameService(user.userToken.token, formData.firstname);
            } else if (formData.lastname) {
                data = await fetchLastNameService(user.userToken.token, formData.lastname);
            } else {
                setFormErrors({
                    message: "Please fill in at least one filter field.",
                    activate: true,
                });
                return;
            }

            if (data instanceof AxiosError) {
                handleAxiosError(data);
            } else {
                setUsers([data]);
                alertUserCreated();
            }
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            setFormErrors({
                message: "An unexpected error occurred",
                activate: true,
            });
        }
    };

    const handleAxiosError = (error) => {
        if (error.response.status === 500) {
            setFormErrors({
                message: "Server internal error... please contact support",
                activate: true,
            });
        } else if (error.response.status === 401) {
            setFormErrors({
                message: "Data entered incorrectly",
                activate: true,
            });
        }
    };

    const handleClearFilters = async () => {
        setFormData({ email: "", firstname: "", lastname: "" });
        setFormErrors({});

        try {
            const fetchedUsers = await fetchUsersService(user.userToken.token);
            setUsers(fetchedUsers.users);
        } catch (error) {
            console.error('Error fetching users after clearing filters:', error);
        }
    };

    const handleViewClick = (userId) => {
        navigate(`/user/${userId}`);
    };

    const handleModClick = (userId) => {
        navigate(`/adminModify/${userId}`)
    }

    const handleDisableClick = async (userId) => {
        setClick(true)
        const disable = await disableService(user.userToken.token, userId)
    }

    if (loading) {
        return <div className="card flex justify-content-center">
                <ProgressSpinner />
            </div>
    }

    if (users.length === 0) {
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
                    <button type="submit">Apply Filter</button>
                </form>
                <button type="button" onClick={handleClearFilters}>Clear Filters</button>
                {formErrors.activate && (
                    <div className="error-message">
                        {formErrors.message}
                    </div>
                )}
            </aside>

            <section className={cssGetAll.policies}>
                {users.map(user => (
                    <div className={cssGetAll.policyCard} key={user.userId}>
                        <h3>{user.userFirstName} {user.userLastName}</h3>
                        <p>{user.userBirthDate}</p>
                        <p>Wellcare</p>
                        {user.userEnabled && (
                            <>
                                <p>Enabled</p>
                                <div className={cssGetAll.icons}>
                                    <img
                                        src="../../public/img/enabled.png"
                                        alt="View"
                                        className={cssGetAll.icon}
                                        onClick={() => handleDisableClick(user.userId)}
                                    />

                                    <img
                                        src="../../public/img/ojo.png"
                                        alt="View"
                                        className={cssGetAll.icon}
                                        onClick={() => handleViewClick(user.userId)}
                                    />
                                    <img
                                        src="../../public/img/lapiz.png"
                                        alt="Edit"
                                        className={cssGetAll.icon}
                                        onClick={() => handleModClick(user.userId)}
                                    />
                                </div>
                            </>

                        )}
                        {!user.userEnabled && (
                            <>
                                <p>Disabled</p>
                                <div className={cssGetAll.icons}>
                                    <img
                                        src="../../public/img/disabled.png"
                                        alt="View"
                                        className={cssGetAll.icon}
                                        onClick={() => handleDisableClick(user.userId)}
                                    />

                                    <img
                                        src="../../public/img/ojo.png"
                                        alt="View"
                                        className={cssGetAll.icon}
                                        onClick={() => handleViewClick(user.userId)}
                                    />
                                    <img
                                        src="../../public/img/lapiz.png"
                                        alt="Edit"
                                        className={cssGetAll.icon}
                                        onClick={() => handleModClick(user.userId)}
                                    />
                                </div>
                            </>
                        )}

                    </div>
                ))}
            </section>
        </main>
    );
}

export default GetAll;
