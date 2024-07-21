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

export async function registerServices(userToken, firstName,lastName,birthDate,address,phone,email){
    try {
        const data ={
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            address: address,
            phone: phone,
            email: email,
        }
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
        return response
    } catch (error) {
        return error
    }
}