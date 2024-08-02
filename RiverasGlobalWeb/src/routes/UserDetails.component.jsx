import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { fetchUserByIdService } from '../services/session.services';
import { userContext } from "../context/userProvider.context.jsx";
import cssPreview from "../assets/css/prev-datos.module.css";

function UserDetails() {
    const { user } = useContext(userContext);
    const { userId } = useParams();
    const [specificUser, setSpecificUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('userId from useParams:', userId); // Log para verificar el userId
        const fetchUser = async () => {
            try {
                const userData = await fetchUserByIdService(user.userToken.token, userId);
                console.log('Fetched user data:', userData);
                setSpecificUser(userData);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUser();
        } else {
            console.error('userId is undefined');
            setLoading(false);
        }
    }, [user.userToken.token, userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!specificUser) {
        return <div>User not found</div>;
    }

    return (
        <main>
            <section className={cssPreview.policyDetails}>
                <div className={cssPreview.detailsHeader}>
                    <div className={cssPreview.initials}>
                        {specificUser.userFirstName.charAt(0)}{specificUser.userLastName.charAt(0)}
                    </div>
                    <h2>{specificUser.userFirstName} {specificUser.userLastName}</h2>
                </div>
                <div className={cssPreview.detailsContent}>
                    
                    <div className={cssPreview.data}>
                        <div className={cssPreview.row}>
                            <label htmlFor="name">Name</label>
                            <p id="name">{specificUser.userFirstName} {specificUser.userLastName}</p>
                        </div>

                        <div className={cssPreview.row}>
                            <label htmlFor="Mail">Mail</label>
                            <p id="Mail">{specificUser.userEmail}</p>
                        </div>

                        <div className={cssPreview.row}>
                            <label htmlFor="cellphone">Cellphone</label>
                            <p id="cellphone">{specificUser.userPhone}</p>
                        </div>

                        <div className={cssPreview.row}>
                            <label htmlFor="birth">Birth</label>
                            <p id="birth">{specificUser.userBirthDate}</p>
                        </div>

                        <div className={cssPreview.row}>
                            <label htmlFor="age">Age</label>
                            <p id="age">{specificUser.age} años</p>
                        </div>

                        <div className={cssPreview.row}>
                            <label htmlFor="address">Address</label>
                            <p id="address">{specificUser.userAddress}</p>
                        </div>

                    </div>
                    <button className={cssPreview.more}>See More</button>
                </div>
            </section>
        </main>
    );
}

export default UserDetails;
