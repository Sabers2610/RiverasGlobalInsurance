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

export async function updateUserService(userToken, firstName, lastName, birthDate, address, phone, email, currentPassword, password, password2) {
    try {
        const DATA = {
            firstName,
            lastName,
            birthDate,
            address,
            phone,
            email,
            currentPassword,
            password,
            password2
        }
        const RESPONSE = await axios.post("http://localhost:3000/api/v1/modifyUser", DATA, {
            headers: {
                "Authorization": `Bearer ${userToken}`,
                "Content-Type": "application/json"

            },
            withCredentials: true,
        })

        return RESPONSE.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return { error: true, messages: error.response.data.errors, status: error.response.status };
        }
        return { error: true, messages: 'Server error, please try again later.', status: error.response.status };
    }
}
