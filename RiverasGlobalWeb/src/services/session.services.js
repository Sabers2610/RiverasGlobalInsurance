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
        console.log("Tambien pase por aqui")
        console.log(response.data)
        return response.data
    } catch (error) {
        return error
    }
}

export async function registerServices(firstName,lastName,birthDate,address,phone,email,password, passwordConfirmed){
    try {
        const data ={
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            address: address,
            phone: phone,
            email: email,
            password: password,
            passwordConfirmed : passwordConfirmed
        }
        const response = await axios.post("http://localhost:3000/api/v1/register", data, {
            headers: {
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