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