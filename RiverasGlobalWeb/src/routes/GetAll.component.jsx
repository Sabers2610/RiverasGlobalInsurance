import { useNavigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import "../../public/assets/css/prev-datos.css";
import { fetchUsersService } from "../services/session.services";
import { userContext } from "../context/userProvider.context.jsx";

function GetAll() {
    const { user, setUser } = useContext(userContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        navigate("/GetAll");

        const fetchUsers = async () => {
            try {
                const fetchedUsers = await fetchUsersService();
                if (Array.isArray(fetchedUsers) && fetchedUsers.length > 0) {
                    setUser(fetchedUsers[0]); 
                } else {
                    console.error('No users found');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [navigate, setUser]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>No user data available</div>; // Handle no data state
    }

    return (
        <main>
            <aside>
                <h2>Wacoldo Soto</h2>
            </aside>

            <section className="policy-details">
                <div className="details-header">
                    <div className="initials">{user.userFirstName ? user.userFirstName[0] : '?'}</div>
                    <h2>{user.userFirstName || 'No Name'}</h2>
                </div>
                <div className="details-content">
                    <div className="data">
                        <div className="row">
                            <label htmlFor="nombre">Name</label>
                            <div>{user.userFirstName} {user.userLastName}</div>
                        </div>

                        <div className="row">
                            <label htmlFor="correo">Mail</label>
                            <div>{user.userEmail}</div>
                        </div>

                        <div className="row">
                            <label htmlFor="nombre">MBI</label>
                        </div>
                        <div className="row">
                            <label htmlFor="nombre">Cellphone</label>
                            <div>{user.userPhone}</div>
                        </div>

                        <div className="row">
                            <label htmlFor="nombre">Birth</label>
                            <div>{user.userBirthDate}</div>
                        </div>

                        <div className="row">
                            <label htmlFor="nombre">Age</label>
                        </div>

                        <div className="row">
                            <label htmlFor="nombre">Genre</label>
                        </div>

                        <div className="row">
                            <label htmlFor="nombre">Date of registration</label>
                            <div>{user.createdAt}</div>
                        </div>

                        <div className="row">
                            <label htmlFor="nombre">Address</label>
                            <div>{user.userAddress}</div>
                        </div>

                        <div className="row">
                            <label htmlFor="nombre">City</label>
                        </div>

                        <div className="row">
                            <label htmlFor="nombre">Country</label>
                        </div>

                        <div className="row">
                            <label htmlFor="nombre">Zip code</label>
                        </div>
                    </div>
                    <button className="more">See More</button>
                </div>
            </section>
        </main>
    );
}

export default GetAll;