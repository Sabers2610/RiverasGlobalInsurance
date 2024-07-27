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

export async function changePasswordServices(userToken, password, password2) {
    try {
        let data = { password, password2 }
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
        let data = { email }
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

export async function validateTokenServices(resetToken) {
    try {
        const response = await axios.get(`http://localhost:3000/api/v1/verifyToken/${resetToken}`, {
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

export async function recoveryPasswordServices(resetToken, password, password2) {
    try {
        let data = { password, password2 }
        const response = await axios.post(`http://localhost:3000/api/v1/recoveryPassword/${resetToken}`, data, {
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

export async function refreshTokenServices(){
    try {
        const response = await axios.get(`http://localhost:3000/api/v1/refreshToken`, {
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

export async function autoLoginServices(userToken){
    try {
        const response = await axios.get(`http://localhost:3000/api/v1/autologin`, {
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

export default { 
    loginServices, 
    autoLoginServices, 
    logoutServices, 
    refreshTokenServices, 
    recoveryPasswordServices,
    validateTokenServices,
    verifyEmailServices,
    changePasswordServices
}