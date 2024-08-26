import request from 'supertest'
import { APP } from '../src/index.js'



describe('API Endpoints', () => {
    let GLOBALTOKEN = null
    describe('POST /login', () => {
        it('should log in with valid credentials', async () => {
            const credentials = {
                email: 'lu.saezd@duocuc.cl',
                password: 'Erwin123*'
            };

            const response = await request(APP)
                .post('/api/v1/login')
                .send(credentials)
                .set('Accept', 'application/json');

            expect(response.status).toBe(202);
            expect(response.body).toHaveProperty("userId")
            expect(response.body).toHaveProperty("userToken")
            GLOBALTOKEN = response.body.userToken.token
        });

        it('should not log in with invalid credentials', async () => {
            const credentials = {
                email: 'felix@gmail.com',
                password: 'GlobalInsurance'
            };

            const response = await request(APP)
                .post('/api/v1/login')
                .send(credentials)
                .set('Accept', 'application/json');

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("msg")
        });

        it('should not log in with disabled account', async () => {
            const credentials = {
                email: 'pepito@gmail.com',
                password: 'GlobalInsurance#2024'
            };

            const response = await request(APP)
                .post('/api/v1/login')
                .send(credentials)
                .set('Accept', 'application/json');

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("msg")
            console.log(response)
        })
    });

    describe('POST /changePassword', () => {
        it('should send a valid password', async () => {
            const data = {
                password: "Erwin123*",
                password2: "Erwin123*"
            }

            const response = await request(APP)
                .post("/api/v1/changePassword")
                .send(data)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${GLOBALTOKEN}`)

            expect(response.status).toBe(200)
            expect(response.body.message).toBe("Password changed successfully")
        })

        it('should send a invalid password', async () => {
            const data = {
                password: "password1 invalid format",
                password2: "password1 invalid format"
            }

            const response = await request(APP)
                .post("/api/v1/changePassword")
                .send(data)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${GLOBALTOKEN}`)

            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty("msg")
            console.log(response)
        })
    })

    describe("POST /verifyEmail", () => {
        it("should send a registered and valid email", async () => {
            const data = {
                email: "lu.saezd@duocuc.cl"
            }

            const response = await request(APP)
                .post("/api/v1/verifyEmail")
                .send(data)
                .set("Accept", "application/json")
            
            expect(response.status).toBe(200)
            expect(response.body.message).toBe("Email send successfully")
        })

        it("should send a unregistered email", async () => {
            const data = {
                email: "luissaezddd@gmail.com"
            }

            const response = await request(APP)
                .post("/api/v1/verifyEmail")
                .send(data)
                .set("Accept", "application/json")
            
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty("msg")
        })

        it("should send a disabled account's email", async () => {
            const data = {
                email: "pepito@gmail.com"
            }

            const response = await request(APP)
                .post("/api/v1/verifyEmail")
                .send(data)
                .set("Accept", "application/json")
            
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty("msg")
        })
    })

    describe("GET /refreshtoken", () => {
        it("should send a valid refreshtoken", async () => {
            const response = await request(APP)
                .get("/api/v1/refreshtoken")
                .set("Cookie", "refreshToken=Valid_Refresh_TOKEN") //REVISAR!
            
                expect(response.status).toBe(200)
                expect(response.body).toHaveProperty("token")
        })
    })

    describe("POST /autologin", () => {
        it("should log in with a valid token refreshed", async () => {
            const response = await request(APP)
                .send("/api/v1/autologin")
                .set("Authorization", `Bearer ${GLOBALTOKEN}`)
            
            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty("userId")
            expect(response.body).toHaveProperty("userToken")
        })
        
        it("should log in with a invalid token refreshed", async () => {
            const response = await request(APP)
                .send("/api/v1/autologin")
                .set("Authorization", "invalid token")
            
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty("msg")
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

    describe("XSS vulnerability describe", () => {
        let xssPayload = "<script>alert('XSS');</script>"

        it("should be protected in login", async () => {
            const data = {
                email: xssPayload,
                password: xssPayload
            }

            const response = await request(APP)
                .post("/api/v1/login")
                .send(data)
                .set("Accept", "application/json")
            
            expect(response.text).not.toContain(xssPayload)
        })

        it("should be protected in verify email", async () => {
            const data = {
                email: xssPayload
            }

            const response = await request(APP)
                .post("/api/v1/verifyEmail")
                .send(data)
                .set("Accept", "application/json")
            
            expect(response.text).not.notContain(xssPayload)
        })

        it("should be protected in recovery password", async () => {
            const data = {
                password: xssPayload,
                password2: xssPayload
            }

            const response = await request(APP)
                .post("/api/v1/recoveryPassword/VALID_TOKEN")
                .send(data)
                .set("Accept", "application/json")
            
            expect(response.text).not.notContain(xssPayload)
        })

        it("should be protected in change password", async() => {
            const data = {
                password: xssPayload,
                password2: xssPayload
            }

            const response = await request(APP)
                .post("/api/v1/changePassword")
                .send(data)
                .set("Accept", "application/json")
            
            expect(response.text).not.notContain(xssPayload)
        })
    })

    describe("SQL inyection vulnerability describe", () => {
        let maliciousQuery = "' OR '1'='1"

        it("Should not send information with a query", async () => {
            const data = { 
                email: maliciousQuery,
                password: maliciousQuery
            }
            const response = await request(APP)
                .post("/api/v1/login")
                .send(data)
                .set("Accept", "application/json")

            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty("error")
        })

        it("should be protected in verify email", async () => {
            const data = {
                email: maliciousQuery
            }

            const response = await request(APP)
                .post("/api/v1/verifyEmail")
                .send(data)
                .set("Accept", "application/json")
            
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty("error")
        })

        it("should be protected in recovery password", async () => {
            const data = {
                password: maliciousQuery,
                password2: maliciousQuery
            }

            const response = await request(APP)
                .post("/api/v1/recoveryPassword/VALID_TOKEN")
                .send(data)
                .set("Accept", "application/json")
            
                expect(response.status).toBe(400)
                expect(response.body).toHaveProperty("error")
        })

        it("should be protected in change password", async() => {
            const data = {
                password: maliciousQuery,
                password2: maliciousQuery
            }

            const response = await request(APP)
                .post("/api/v1/changePassword")
                .send(data)
                .set("Accept", "application/json")
            
                expect(response.status).toBe(400)
                expect(response.body).toHaveProperty("error")
        })
    })
});