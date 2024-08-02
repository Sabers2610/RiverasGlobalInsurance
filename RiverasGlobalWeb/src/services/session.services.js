import axios from 'axios'

export async function loginServices(email, password) {
    try {
        const data = {
            email: email,
            password: password
        }
        const response = await axios.post("http://localhost:3000/api/v1/login", data, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true,
        })
        response.data.success = true
        return response.data
    } catch (error) {
        console.log(error)
        if (error.response) {
            // Request made and server responded
            return { success: false, status: error.response.status, message: error.response.data.message || error.message };
        } else if (error.request) {
            // The request was made but no response was received
            return { success: false, status: null, message: "No response received from server. Please check your internet connection." };
        } else {
            // Something happened in setting up the request that triggered an Error
            return { success: false, status: null, message: error.message };
        }
    }
}

export async function registerServices(userToken, firstName,lastName,birthDate,address,phone,email){
    try {
        console.log("Entre al services")
        const data ={
            firstName,
            lastName,
            birthDate,
            address,
            phone,
            email,
        }
        console.log(data)
        console.log(userToken)
        const response = await axios.post("http://localhost:3000/api/v1/register", data, {
            headers: {
                "Authorization": `Bearer ${userToken}`,
                "Content-Type": "application/json"
            },
            withCredentials: true,
        })
        console.log(response.data)
        return response.data
    } catch (error) {
        return error
    }
}

export async function logoutServices(userToken) {
    try {
        const response = await axios.post("http://localhost:3000/api/v1/logout", {}, {
            headers: {
                "Authorization": `Bearer ${userToken}`,
                "Content-Type": "application/json"
            },
            withCredentials: true,
        })
        return response
    } catch (error) {
        return error
    }
}


export async function changePasswordServices(userToken, password, password2){
    try {
        let data = { password, password2}
        const response = await axios.post("http://localhost:3000/api/v1/changePassword", data, {
            headers: {
                "Authorization": `Bearer ${userToken}`,
                "Content-Type": "application/json"
            },
            withCredentials: true,
        })
        response.data.success = true
        return response.data
    } catch (error) {
        console.log(error)
        if (error.response) {
            // Request made and server responded
            return { success: false, status: error.response.status, message: error.response.data.message || error.message };
        } else if (error.request) {
            // The request was made but no response was received
            return { success: false, status: null, message: "No response received from server. Please check your internet connection." };
        } else {
            // Something happened in setting up the request that triggered an Error
            return { success: false, status: null, message: error.message };
        }
    }
}

export async function verifyEmailServices(email) {
    try {
        let data = {email}
        const response = await axios.post("http://localhost:3000/api/v1/verifyEmail", data, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true,
        })
        response.data.success = true
        return response.data
    } catch (error) {
        console.log(error)
        if (error.response) {
            // Request made and server responded
            return { success: false, status: error.response.status, message: error.response.data.message || error.message };
        } else if (error.request) {
            // The request was made but no response was received
            return { success: false, status: null, message: "No response received from server. Please check your internet connection." };
        } else {
            // Something happened in setting up the request that triggered an Error
            return { success: false, status: null, message: error.message };
        }
    }

}

export async function fetchUsersService(userToken) {
    try {
        const response = await axios.get("http://localhost:3000/api/v1/getAll",  {
            headers: {
                "authorization": `Bearer ${userToken}`, 
                "Content-Type": "application/json"
            },
            withCredentials: true,
        });
        return {users:response.data, success:true}
    } catch (error) {
        console.error('Error fetching users:', error.response ? error.response.data : error.message);
        return error;
    }
}

export async function fetchEmailService(userToken, email) {
    try {
        const data ={
            email
        }


        const response = await axios.post("http://localhost:3000/api/v1/findEmail", data,  {
            headers: {
                "authorization": `Bearer ${userToken}`, 
                "Content-Type": "application/json"
            },
            withCredentials: true,
        });

        return response.data; 

    } catch (error) {
        console.error('Error fetching users:', error.response ? error.response.data : error.message);
        return error;
    }
}



export async function fetchFirstNameService(userToken, firstName) {
    try {
        const data = { firstName };

        const response = await axios.post("http://localhost:3000/api/v1/findFirstName", data, {
            headers: {
                "authorization": `Bearer ${userToken}`,
                "Content-Type": "application/json"
            },
            withCredentials: true,
        });

        return response.data;

    } catch (error) {
        console.error('Error fetching users:', error.response ? error.response.data : error.message);
        return error;
    }
}

export async function fetchLastNameService(userToken, lastName) {
    try {
        const data = { lastName };

        const response = await axios.post("http://localhost:3000/api/v1/findLastName", data, {
            headers: {
                "authorization": `Bearer ${userToken}`,
                "Content-Type": "application/json"
            },
            withCredentials: true,
        });

        return response.data;

    } catch (error) {
        console.error('Error fetching users:', error.response ? error.response.data : error.message);
        return error;
    }
}

export const fetchUserByIdService = async (userToken, id) => {

    try{
        const response = await axios.get(`http://localhost:3000/api/v1/user/${id}`,{
            headers: {
                "authorization": `Bearer ${userToken}`,
                "Content-Type": "application/json"
            },
            withCredentials: true,
        });
    
        return response.data

    }catch (error) {
        console.log(error)
        if (error.response) {
            // Request made and server responded
            return { success: false, status: error.response.status, message: error.response.data.message || error.message };
        } else if (error.request) {
            // The request was made but no response was received
            return { success: false, status: null, message: "No response received from server. Please check your internet connection." };
        } else {
            // Something happened in setting up the request that triggered an Error
            return { success: false, status: null, message: error.message };
        }
    }
};

export async function updateAdminService(userToken, id, firstName, lastName, birthDate, address, phone, email) {
    try {
        console.log("entra al service")
        const DATA = {
            firstName,
            lastName,
            birthDate,
            address,
            phone,
            email
        };
        const RESPONSE = await axios.post(`http://localhost:3000/api/v1/adminModify/${id}`, DATA, {
            headers: {
                "Authorization": `Bearer ${userToken}`,
                "Content-Type": "application/json"
            },
            withCredentials: true,
        });

        return RESPONSE.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return { error: true, messages: error.response.data.errors, status: error.response.status };
        }
        return { error: true, messages: 'Server error, please try again later.', status: 500 };
    }
}


export async function disableService(userToken, id) {
    try {

        const RESPONSE = await axios.get(`http://localhost:3000/api/v1/userDisable/${id}`, {
            headers: {
                "Authorization": `Bearer ${userToken}`,
                "Content-Type": "application/json"
            },
            withCredentials: true,
        });

        return RESPONSE.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return { error: true, messages: error.response.data.errors, status: error.response.status };
        }
        return { error: true, messages: 'Server error, please try again later.', status: 500 };
    }
}

