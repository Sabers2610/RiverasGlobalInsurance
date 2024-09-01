import request from 'supertest'
import { APP } from '../src/index.js'
import {describe, it, expect} from '@jest/globals'

describe("Api endpoints test", () => {
    let GLOBALTOKEN = null
    let GLOBALCOOKIE = null
    let MALICIOUSQUERY = "' OR '1'='1"
    let XSS = "<script>alert('XSS');</script>"
    let RECOVERYTOKEN=null
    describe("POST /login", () => {
        it("Should log in with valid credentials", async () => {
            const data = {
                email: "lu.saezd@duocuc.cl",
                password: "Erwin123*"
            }

            const response = await request(APP)
                .post("/api/v1/login")
                .set("Accept", "application/json")
                .send(data)
            
            expect(response.status).toBe(202)
            expect(response.body).toHaveProperty("userId")
            expect(response.body).toHaveProperty("userToken")
            GLOBALTOKEN = response.body.userToken.token
            GLOBALCOOKIE = response.headers["set-cookie"][0]
        })

        it("should'n log in with invalid credentials", async () => {
            const data = {
                email: "lu.saez@duocuc.cl", // correo inexistente
                password: "Erwin123*"
            }

            const response = await request(APP)
                .post("/api/v1/login")
                .set("Accept", "application/json")
                .send(data)
            
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty("msg")
        })

        it("should'n log in with a disabled account", async () =>{
            const data = {
                email: "pepito@gmail.com", // correo desactivado
                password: "Erwin123*"
            }

            const response = await request(APP)
                .post("/api/v1/login")
                .set("Accept", "application/json")
                .send(data)
            
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty("msg")
        })

        it("should have SQL protection in log in", async () => {
            const data = {
                email: MALICIOUSQUERY,
                password: MALICIOUSQUERY
            }

            const response = await request(APP)
                .post("/api/v1/login")
                .set("Accept", "application/json")
                .send(data)
            console.log("response failed info: ", {
                method: response.request.method,
                text: response.text,
                headers: response.headers,
                body: response.body
            })
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty("errors")
        })

        it("should have XSS protection in log in", async () =>{
            const data = {
                email: XSS,
                password: XSS
            }

            const response = await request(APP)
                .post("/api/v1/login")
                .set("Accept", "application/json")
                .send(data)
            console.log("response failed info: ", {
                method: response.request.method,
                text: response.text,
                headers: response.headers,
                body: response.body
            })
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty("errors")
        })
    })

    describe("POST /changePassword", () =>{
        let CHANGETOKEN = null
        it("should send a valid password", async()=>{
            const data_login = {
                email: "jose@gmail.com",
                password: "Erwin123*" // ya funciona pero coloco la misma password
            }
            let response = await request(APP)
                .post("/api/v1/login")
                .send(data_login)
                .set("Accept", "application/json")
            CHANGETOKEN = response.body.userToken.token

            const data = {
                password: "Erwin123*",
                password2: "Erwin123*"
            }
            response = await request(APP)
                .post("/api/v1/changePassword")
                .send(data)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${response.body.userToken.token}`)

            expect(response.status).toBe(200)
            expect(response.body.message).toBe("Password changed successfully")
        })

        it("should send invalid password", async ()=>{
            const data = {
                password: "invalid format password",
                password2: "invalid format password2"
            }
            let response = await request(APP)
                .post("/api/v1/changePassword")
                .send(data)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${CHANGETOKEN}`)

            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty("errors")
        })

        it("should have SQL protection in change password", async()=>{
            const data = {
                password: MALICIOUSQUERY,
                password2: MALICIOUSQUERY
            }
            let response = await request(APP)
                .post("/api/v1/changePassword")
                .send(data)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${CHANGETOKEN}`)
            console.log("response failed info: ", {
                method: response.request.method,
                text: response.text,
                headers: response.headers,
                body: response.body
            })
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty("msg")
        })

        it("should have XSS protection in change password", async () => {
            const data = {
                password: XSS,
                password2: XSS
            }
            let response = await request(APP)
                .post("/api/v1/changePassword")
                .send(data)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${CHANGETOKEN}`)
            console.log("response failed info: ", {
                method: response.request.method,
                text: response.text,
                headers: response.headers,
                body: response.body
            })
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty("errors")
        })
    })

    describe("POST /verifyEmail", () =>{
        it("Should send a valid and registered email", async () => {
            const data = {
                email: "lu.saezd@duocuc.cl"
            }

            const response = await request(APP)
                .post("/api/v1/verifyEmail")
                .send(data)
                .set("Accept", "application/json")

            expect(response.status).toBe(200)
            expect(response.body.message).toBe("Email send successfully")
            RECOVERYTOKEN = response.body.recoveryToken
        })

        it("Should send a valid and unregistered email", async () => {
            const data = {
                email: "lu.saez@duocuc.cl"
            }

            const response = await request(APP)
                .post("/api/v1/verifyEmail")
                .send(data)
                .set("Accept", "application/json")

            expect(response.status).toBe(401)
            expect(response.body.msg).toBe("The email address doesn't exist")
        })

        it("Should send a valid and disbale email's account", async() => {
            const data = {
                email: "pepito@gmail.com"
            }

            const response = await request(APP)
                .post("/api/v1/verifyEmail")
                .send(data)
                .set("Accept", "application/json")

            expect(response.status).toBe(401)
            expect(response.body.msg).toBe("The email address doesn't exist")
        })

        it("Should send a invalid email", async () =>{
            const data = {
                email: "pepito@gmail"
            }

            const response = await request(APP)
                .post("/api/v1/verifyEmail")
                .send(data)
                .set("Accept", "application/json")

            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty("errors")
        })

        it("Should have SQL protection in verify email", async () => {
            const data = {
                email: MALICIOUSQUERY
            }

            const response = await request(APP)
                .post("/api/v1/verifyEmail")
                .send(data)
                .set("Accept", "application/json")
            console.log("response failed info: ", {
                method: response.request.method,
                text: response.text,
                headers: response.headers,
                body: response.body
            })
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty("errors")
        })

        it("Should have XSS protection  in verify email", async () => {
            const data = {
                email: XSS
            }

            const response = await request(APP)
                .post("/api/v1/verifyEmail")
                .send(data)
                .set("Accept", "application/json")
            console.log("response failed info: ", {
                method: response.request.method,
                text: response.text,
                headers: response.headers,
                body: response.body
            })
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty("errors")
        })
    })

    describe("GET /refreshToken", ()=>{
        it("Should send a valid refreshtoken", async () => {
            const response = await request(APP)
                .get("/api/v1/refreshtoken")
                .set("Cookie", GLOBALCOOKIE) //REVISAR!
            
                expect(response.status).toBe(200)
                expect(response.body).toHaveProperty("token")
        })

        it("Should'n send a valid refreshtoken", async () => {
            const response = await request(APP)
                .get("/api/v1/refreshtoken")
                .set("Cookie", "ASKLJDLAKSJDLKASJDLKASJDLKASJDLKASJDLKSAJDLKASJDLKAJDKLSJDLKJSAKLDJALKJDASLKJDALKSJDLKASJD") //REVISAR!
            
                expect(response.status).toBe(400)
                expect(response.body).toHaveProperty("errors")
        })

        it("Should'n send refreshtoken", async () => {
            const response = await request(APP)
                .get("/api/v1/refreshtoken")
            
                expect(response.status).toBe(400)
                expect(response.body).toHaveProperty("errors")
        })
    })

    describe("POST /autoLogin", () => {
        it("should log in with a valid token refreshed", async () => {
            const response = await request(APP)
                .get("/api/v1/autologin")
                .set("Authorization", `Bearer ${GLOBALTOKEN}`)
            
            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty("userId")
            expect(response.body).toHaveProperty("userToken")
        })
        
        it("should log in with a invalid token refreshed", async () => {
            const response = await request(APP)
                .get("/api/v1/autologin")
                .set("Authorization", `Bearer ${GLOBALTOKEN}x`)
            
            expect(response.status).toBe(401)
            expect(response.body.message).toBe("Invalid token")
        })
    })

    describe("POST /logout", () => {
        it("should log out successfully", async () => {
            const response = await request(APP)
                .get("/api/v1/logout")
                .set("Authorization", `Bearer ${GLOBALTOKEN}`)

            expect(response.status).toBe(200)
            expect(response.headers["set-cookie"]).toEqual(expect.arrayContaining([expect.stringContaining('refreshToken=;')]))
        })
    })

    describe("POST /recoveryPassword", ()=>{
        it("should send a invalid password", async()=>{
            const data = {
                password: "Erwin123",
                password2: "Erwin123"
            }

            const response = await request(APP)
                .post(`/api/v1/recoveryPassword/${RECOVERYTOKEN}`)
                .send(data)
                .set("Accept", "application/json")

            expect(response.status).toBe(400)
            expect(response.body.msg).toBe("Invalid format password")
        })

        it("should have SQL protection in recovery password", async()=>{
            const data = {
                password: MALICIOUSQUERY,
                password2: MALICIOUSQUERY
            }

            const response = await request(APP)
                .post(`/api/v1/recoveryPassword/${RECOVERYTOKEN}`)
                .send(data)
                .set("Accept", "application/json")
            console.log("response failed info: ", {
                method: response.request.method,
                text: response.text,
                headers: response.headers,
                body: response.body
            })
            expect(response.status).toBe(400)
            expect(response.body.msg).toBe("Invalid format password")
        })

        it("should have XSS protection in recovery password", async()=>{
            const data = {
                password: XSS,
                password2: XSS
            }

            const response = await request(APP)
                .post(`/api/v1/recoveryPassword/${RECOVERYTOKEN}`)
                .send(data)
                .set("Accept", "application/json")
            console.log("response failed info: ", {
                method: response.request.method,
                text: response.text,
                headers: response.headers,
                body: response.body
            })
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty("errors")
        })

        it("should send a valid password", async()=>{
            const data = {
                password: "Erwin123*",
                password2: "Erwin123*"
            }

            const response = await request(APP)
                .post(`/api/v1/recoveryPassword/${RECOVERYTOKEN}`)
                .send(data)
                .set("Accept", "application/json")

            expect(response.status).toBe(200)
            expect(response.body.message).toBe("Password changed successfully")
        })
    })

})