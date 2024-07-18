export function regexPassword(password) {
    const REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&()*\-_=+{};:,<.>])[A-Za-z\d!@#$%^&()*\-_=+{};:,<.>.]{8,}$/;


    let pass = REGEX.test(password)

    if(pass){
        return true
    }
    return false
}