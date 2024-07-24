import { useNavigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import "../../public/assets/css/polizas.css";
import { fetchUsersService } from "../services/session.services";
import { userContext } from "../context/userProvider.context.jsx";

function GetAll() {
    const { user, setUser } = useContext(userContext);


    const navigate = useNavigate();

    const [users, setUsers] = useState({});

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        navigate("/GetAll");

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
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (Object.keys(users).length === 0) {
        return <div>No user data available</div>;
    }

    return (
        <main>
            <aside className="filters">
                <h2>Users</h2>
                <div className="filter-group">
                    <label htmlFor="firstname">First name</label>
                    <input type="text" id="firstname" name="firstname" placeholder="enter the first name..." />
                </div>
                <div className="filter-group">
                    <label htmlFor="lastname">Last name</label>
                    <input type="text" id="lastname" name="lastname" placeholder="enter the Last name..." />
                </div>
                <div className="filter-group">
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" name="email" placeholder="enter the Email..." />
                </div>
                <button type="button">Aplicar filtro</button>
            </aside>

            <section className="policies">
                {Object.keys(users).map(key => {
                    const user = users[key];
                    return (
                        <div className="policy-card" key={key}>
                            <h3>{user.userFirstName} {user.userLastName}</h3>
                            <p>{user.userBirthDate}</p>
                            <p>Procesado</p>
                            <p>Wellcare</p>
                            <div className="icons">
                                <img src="../assets/img/ojo.png" alt="View" className="icon" />
                                <img src="../assets/img/lapiz.png" alt="Edit" className="icon" />
                            </div>
                        </div>
                    );
                })}
            </section>
        </main>
    );
}

export default GetAll;
