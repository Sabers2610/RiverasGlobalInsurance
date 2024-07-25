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

export async function updateUserService(userToken, firstName, lastName, birthDate, address, phone, email, password, password2) {
    try {
        const data = {
            firstName,
            lastName,
            birthDate,
            address,
            phone,
            email,
            password,
            password2
        }
        const response = await axios.post("http://localhost:3000/api/v1/modifyUser", data, {
            headers: {
                "Authorization": `Bearer ${userToken}`,
                "Content-Type": "application/json"

            },
            withCredentials: true,
        })

        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return { error: true, messages: error.response.data.errors };
        }
        return { error: true, messages: [{ msg: 'Server error, please try again later.' }] };
    }
}
